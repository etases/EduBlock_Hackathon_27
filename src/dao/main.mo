import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Iter "mo:base/Iter";

actor DAO {
  public type Time = Time.Time;
  public type UserIdentity = Principal;
  public type HashMap<K, V> = HashMap.HashMap<K, V>;

  public type StudentSubject = {
    name : Text;
    firstHalfScore : Float;
    secondHalfScore : Float;
    finalScore : Float;
    resitScore : Float;
  };

  public type StudentGrade = {
    name : Text;
    subjects : [StudentSubject];
  };

  public type Student = {
    grades : [StudentGrade];
  };

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

  //Create vote function
  public shared({caller}) func vote(args: VoteArgs) : async Response {
    if (_isVoted(caller, args.requestId)) {
      return { errorCode = 1; errorMessage = "You have already voted"; };
    };

    _addVote(caller, args);
    return { errorCode = 0; errorMessage = "Vote Success" };
  };
};