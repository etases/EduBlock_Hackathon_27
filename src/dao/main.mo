import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Iter "mo:base/Iter";

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
  };

  public type StudentUpdateRequestResponse = {
    id : Nat;
    request : StudentUpdateRequest;
  };

  public type StudentUpdateTicket = {
    identity : UserIdentity;
    student : Student;
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

  private func _addRequest(requester : UserIdentity, ticket : StudentUpdateTicket) : () {
    nextTokenId += 1;
    let request : StudentUpdateRequest = {
      identity = requester;
      student = ticket.student;
      requester = requester;
      timestamp = Time.now();
    };
    requests.put(nextTokenId, request);
  };

  /**
   * Vote Function
   */
  public shared({caller}) func vote(args: VoteArgs) : async Response {
    if ((await Token.balanceOf(caller)) < minimumTokensToVote) {
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
};