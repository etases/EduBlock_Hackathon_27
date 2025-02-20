import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Prelude "mo:base/Prelude";
import Option "mo:base/Option";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

import Backend "canister:backend";
import Token "canister:token";

actor DAO {
  public type Time = Time.Time;
  public type UserIdentity = Principal;
  public type HashMap<K, V> = HashMap.HashMap<K, V>;
  public type Student = Backend.Student;

  public type StudentUpdateRequest = {
    identity : UserIdentity;
    student : Student;
    requester : UserIdentity;
    timestamp : Time;
    reason : Text;
  };

  public type StudentUpdateRequestResponse = {
    id : Nat;
    request : StudentUpdateRequest;
  };

  public type StudentUpdateTicket = {
    identity : UserIdentity;
    student : Student;
    reason : Text;
  };

  public type Vote = {
    requestId: Nat;
    vote: Bool;
    timestamp: Time;
    voter: UserIdentity
  };

  public type VoteArgs = {
    requestId: Nat;
    vote: Bool;
  };

  public type Response = {
    errorCode: Int;
    errorMessage: Text;
  };

  private stable let minimumTokensToVote : Nat = 10000;
  private stable let minimumVoteToAccept : Nat = 2;
  private stable let maximumRequestDurationSeconds : Nat =  60 * 60 * 24 * 7; // 1 week

  private stable var nextTokenId : Nat = 0;
  private stable var votes : [Vote] = [];
  private stable var requestEntries : [(Nat, StudentUpdateRequest)] = [];
  private let requests : HashMap<Nat, StudentUpdateRequest> = HashMap.fromIter(requestEntries.vals(), 10, Int.equal, Int.hash);

  system func preupgrade() {
    requestEntries := Iter.toArray(requests.entries());
  };

  system func postupgrade() {
    requestEntries := [];
  };

  private func _optional<T>(value : T) : ?T {
    Option.make(value);
  };

  private func _optionalBreak<T>(value : ?T) : T {
    Option.unwrap(value);
  };

  private func _isVoted(voter : UserIdentity, requestId : Nat) : Bool {
    let found : ?Vote = Array.find(votes, func (v : Vote) : Bool {
      return v.voter == voter and v.requestId == requestId;
    });
    return switch (found) {
      case null false;
      case _ true;
    }
  };

  private func _addVote(voter : UserIdentity, voteArgs : VoteArgs) : () {
    let vote : Vote = {
      requestId = voteArgs.requestId;
      vote = voteArgs.vote;
      timestamp = Time.now();
      voter = voter;
    };
    votes := Array.append(votes, [vote]);
  };

  private func _removeRequest(requestId : Nat) : () {
    switch (requests.remove(requestId)) {
      case null return;
      case _ {
        votes := Array.filter(votes, func (v : Vote) : Bool {
          return v.requestId != requestId;
        });
      };
    };
  };

  private func _getRequest(requestId : Nat) : ?StudentUpdateRequest {
    return requests.get(requestId);
  };

  private func _getRequestIfAccepted(requestId : Nat) : ?StudentUpdateRequest {
    switch (_getRequest(requestId)) {
      case (null) null;
      case (?request) {
        let vote : Nat = Array.foldLeft(votes, 0, func (c : Nat, v : Vote) : Nat {
          if (v.requestId == requestId and v.vote) {
            return c + 1;
          } else {
            return c;
          };
        }); 
        if (vote < minimumVoteToAccept) {
          return null;
        } else {
          return _optional(request);
        };
      };
    };
  };

  private func _addRequest(requester : UserIdentity, ticket : StudentUpdateTicket) : () {
    nextTokenId += 1;
    let request : StudentUpdateRequest = {
      identity = ticket.identity;
      student = ticket.student;
      requester = requester;
      timestamp = Time.now();
      reason = ticket.reason;
    };
    requests.put(nextTokenId, request);
  };

  /**
   * Check if the user can vote on the request.
   */
  public func canVote(identity : UserIdentity) : async Bool {
    (await Token.balanceOf(identity)) >= minimumTokensToVote;
  };

  /**
   * Check if the caller can accept the request.
   */
  public shared({caller}) func canIVote() : async Bool {
    await canVote(caller);
  };

  /**
   * Vote Function
   */
  public shared({caller}) func vote(args: VoteArgs) : async Response {
    if (not (await canVote(caller))) {
      return { errorCode = 1; errorMessage = "You don't have enough credit to vote"; };
    };

    if (_isVoted(caller, args.requestId)) {
      return { errorCode = 2; errorMessage = "You have already voted"; };
    };

    _addVote(caller, args);
    return { errorCode = 0; errorMessage = "Vote Success" };
  };

  /**
   * Get Request Function
   */
  public shared({caller}) func getIncomingRequests() : async [StudentUpdateRequestResponse] {
    let tuples : [(Nat, StudentUpdateRequest)] = Array.filter(Iter.toArray(requests.entries()), func (t : (Nat, StudentUpdateRequest)) : Bool {
      return not _isVoted(caller, t.0);
    });
    return Array.map(tuples, func (t : (Nat, StudentUpdateRequest)) : StudentUpdateRequestResponse {
      return {
        id = t.0;
        request = t.1;
      };
    });
  };

  /**
   * Create Request Function
   */
  public shared({caller}) func createRequest(ticket : StudentUpdateTicket) : async Response {
    _addRequest(caller, ticket);
    return { errorCode = 0; errorMessage = "Request Created" };
  };

  /**
   * The system's scheduler
   */
  private var checkCount : Nat = 0;
  system func heartbeat() : async () {
    if (checkCount <= 10) {
      checkCount += 1;
      return;
    };
    await checkRequests();
    await clearOutdatedRequest();
  };

  /**
   * Check for requests that have accepted and execute them
   */
  private func checkRequests() : async () {
    for (requestId in requests.keys()) {
      let optionRequest : ?StudentUpdateRequest = _getRequestIfAccepted(requestId);
      if (Option.isSome(optionRequest)) {
        _removeRequest(requestId);
        let request : StudentUpdateRequest = _optionalBreak(optionRequest);
        Debug.print("Executing request " # Nat.toText(requestId) # " for " # Principal.toText(request.identity));
        let response : Response = await Backend.updateStudent(request.identity, request.student, _optional(request.requester));
        Debug.print("Response: " # Int.toText(response.errorCode) # " " # response.errorMessage);
      };
    };
  };

  /**
   * Remove requests that are outdated
   */
  private func clearOutdatedRequest() : async () {
    for (requestId in requests.keys()) {
      let optionRequest : ?StudentUpdateRequest = _getRequest(requestId);
      if (Option.isSome(optionRequest)) {
        let request : StudentUpdateRequest = _optionalBreak(optionRequest);
        if (((Time.now() - request.timestamp) / 1000000000) > maximumRequestDurationSeconds) {
          Debug.print("Clearing request " # Nat.toText(requestId));
          _removeRequest(requestId);
        };
      };
    };
  };
};