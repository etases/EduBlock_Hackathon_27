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
};