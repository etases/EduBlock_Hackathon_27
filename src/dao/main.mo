import HashMap "mo:base/HashMap";
import Time "mo:base/Time";

actor DAO {
  public type Time = Time.Time;
  public type UserIdentity = Principal;

  public type StudentSubject = {
    name : Text;
    firstHalfScore : Float;
    secondHalfScore : Float;
    finalScore : Float;
    resitScore : Float;
    teacherName : Text;
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

  //list chua vote, map chua request id key with value type UserIdentity

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

  private stable var listOfVotes : [Vote] = [];
  private let listOfRequests : HashMap<Nat, StudentUpdateRequest> = HashMap.fromIter(listOfVotes.vals(), 10, StudentUpdateRequest.equal, StudentUpdateRequest.hash);



  //Create vote function
  public shared({caller}) func vote(args: VoteArgs) : async Response {

    switch(listOfVotes.get(args)) {  //need to modify
      case (?listOfVotes):
        return {
          errorCode: 1,
          errorMessage: "You have already voted"
        };
      case null:
        listOfVotes.push({ 
          requestId: args.requestId,
          vote: args.vote,
          timestamp: Time,
          voter: caller
        });
    }

      return {
          errorCode: 0,
          errorMessage: "Vote Success"
        };
    }

    return {
      errorCode = 0;
      errorMessage = "Vote success";
    };
  }

};