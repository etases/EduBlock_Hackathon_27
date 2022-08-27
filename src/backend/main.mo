import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import TrieSet "mo:base/TrieSet";
import List "mo:base/List";
import Time "mo:base/Time";
import Prelude "mo:base/Prelude";

shared({caller = owner}) actor class EduBlock() {
  private type Time = Time.Time;
  private type UserIdentity = Principal;
  private type Set<X> = TrieSet.Set<X>;
  private type HashMap<K, V> = HashMap.HashMap<K, V>;

  private type StudentSubject = {
    name : Text;
    firstHalfScore : Float;
    secondHalfScore : Float;
    finalScore : Float;
    resitScore : Float;
    teacherName : Text;
  };

  private type StudentGrade = {
    name : Text;
    subjects : [StudentSubject];
  };

  private type Student = {
    grades : [StudentGrade];
  };

  private type StudentLog = {
    oldStudent : ?Student;
    newStudent : Student;
    teacher : UserIdentity;
    timestamp : Time;
  };

  private type Response = {
    errorCode: Int;
    errorMessage: Text;
  };

  private type ResponseWithData<T> = {
    errorCode: Int;
    errorMessage: Text;
    data: ?T;
  };

  /**
   * The map of possible responses
   */
  private let responses : HashMap<Int, Text> = HashMap.fromIter([
    (0, "Success"),
    (1, "You are not the owner of this block"),
    (2, "You are not a teacher"),
    (3, "You can not get the student"),
    (4, "Only the home teacher can do the action"),
    (5, "Student already exists"),
    (6, "Student does not exist"),
    (7, "Grade does not exist"),
    (8, "You cannot update the student grade")
  ].vals(), 10, Int.equal, Int.hash);

  /**
   * The map of students' principals to their records
   */
  private stable var studentEntries : [(UserIdentity, Student)] = [];
  private let students : HashMap<UserIdentity, Student> = HashMap.fromIter(studentEntries.vals(), 10, Principal.equal, Principal.hash);

  /**
   * The map of history on students' principals to their records
   */
  private stable var studentLogEntries : [(UserIdentity, [StudentLog])] = [];
  private let studentLogs : HashMap<UserIdentity, [StudentLog]> = HashMap.fromIter(studentLogEntries.vals(), 10, Principal.equal, Principal.hash);

  system func preupgrade() {
    studentEntries := Iter.toArray(students.entries());
    studentLogEntries := Iter.toArray(studentLogs.entries());
  };

  system func postupgrade() {
    studentEntries := [];
    studentLogEntries := [];
  };

  public func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  public func greetOwner() : async Text {
    return "Hello, " # Principal.toText(owner) # "!";
  };

  private func _toResponse(errorCode : Int) : Response {
    return {
      errorCode = errorCode;
      errorMessage = switch (responses.get(errorCode)) {
        case (null) "Unknown error";
        case (?x) x;
      };
    };
  };

  private func _toResponseWithData<V>(errorCode : Int, data : ?V) : ResponseWithData<V> {
    return {
      errorCode = errorCode;
      errorMessage = switch (responses.get(errorCode)) {
        case (null) "Unknown error";
        case (?x) x;
      };
      data = data;
    };
  };

  private func _optional<T>(value : T) : ?T {
    return do ? { value };
  };

  private func _optionalBreak<T>(value : ?T) : T {
    switch (value) {
      case (null) Prelude.xxx();
      case (?v) v;
    };
  };

  private func _isOwner(principal : Principal) : Bool {
    return Principal.equal(principal, owner);
  };

  private func _getStudent(student : UserIdentity) : ?Student {
    return students.get(student);
  };

  private func _containsStudent(student : UserIdentity) : Bool {
    switch (_getStudent(student)) {
      case (null) return false;
      case (_) return true;
    };
  };

  private func _getStudentLog(student : UserIdentity) : [StudentLog] {
    return switch (studentLogs.get(student)) {
      case (null) [];
      case (?x) x;
    };
  };

  private func _addStudentToLog(identity : UserIdentity, oldStudent : ?Student, newStudent : Student, teacher : UserIdentity) : () {
    let oldLogs : [StudentLog] = _getStudentLog(identity);
    let newLogs : [StudentLog] = Array.append(oldLogs, [{
      oldStudent = oldStudent;
      newStudent = newStudent;
      timestamp = Time.now();
      teacher = teacher;
    }]);
    studentLogs.put(identity, newLogs);
  };

  private func _replaceStudent(student : UserIdentity, newStudent : Student) : () {
    students.put(student, newStudent);
  };

  private func _addStudent(student : UserIdentity) : Bool {
    if (not _containsStudent(student)) {
      _replaceStudent(student, {
        grades = []
      });
      return true;
    };
    return false;
  };

  private func _getStudentGrades(student : UserIdentity) : ?[StudentGrade] {
    switch (_getStudent(student)) {
      case (null) return null;
      case (?student) return _optional(student.grades);
    };
  };

  private func _getStudentGrade(student : Student, gradeName : Text) : ?StudentGrade {
    for (currentGrade in student.grades.vals()) {
      if (currentGrade.name == gradeName) {
        return _optional(currentGrade);
      };
    };
    return null;
  };

  private func _containsStudentGrade(student : Student, gradeName : Text) : Bool {
    switch (_getStudentGrade(student, gradeName)) {
      case (null) return false;
      case (_) return true;
    };
  };

  private func _addStudentGradeIfNotFound(student : Student, gradeName : Text, homeTeacher : UserIdentity) : Student {
    if (not _containsStudentGrade(student, gradeName)) {
      let newGrades : [StudentGrade] = Array.append(student.grades, [{name = gradeName; subjects = []; homeTeacher = homeTeacher}]);
      return {grades = newGrades};
    };
    return student;
  };

  private func _updateStudentGrade(student : Student, gradeName : Text, grade : StudentGrade) : Student {
    let newGrades : [StudentGrade] = Array.map(student.grades, func(currentGrade : StudentGrade) : StudentGrade {
      if (currentGrade.name == gradeName) {
        return grade;
      };
      return currentGrade;
    });
    return {grades = newGrades};
  };

  private func _getStudentSubjects(student : Student, gradeName : Text) : ?[StudentSubject] {
    switch (_getStudentGrade(student, gradeName)) {
      case (null) return null;
      case (?grade) return _optional(grade.subjects);
    };
  };

  private func _updateStudentSubjects(student : Student, gradeName : Text, subjects : [StudentSubject]) : Student {
    switch (_getStudentGrade(student, gradeName)) {
      case (null) return student;
      case (?grade) {
        let newGrade : StudentGrade = {name = gradeName; subjects = subjects};
        return _updateStudentGrade(student, gradeName, newGrade);
      };
    };
  };

  /**
   * Add a new student to the system
   */
  public shared({caller}) func addStudent(student : UserIdentity) : async Response {
    if (not _isOwner(caller)) {
      return _toResponse(2);
    };

    if (not _addStudent(student)) {
      return _toResponse(5);
    };

    return _toResponse(0);
  };

  /**
   * Add new students to the system
   */
  public shared({caller}) func addStudents(students : [UserIdentity]) : async Response {
    if (not _isOwner(caller)) {
      return _toResponse(2);
    };

    for (currentStudent in students.vals()) {
      let _ : Bool = _addStudent(currentStudent);
    };
    return _toResponse(0);
  };

  /**
   * Get the student by its identity
   */
  public shared({caller}) func getStudent(student : UserIdentity) : async ResponseWithData<Student> {
    switch (_getStudent(student)) {
      case (null) return _toResponseWithData(6, null);
      case (v) return _toResponseWithData(0, v);
    };
  };

  /**
   * Get the student's grades
   */
  public shared({caller}) func getStudentGrades(student : UserIdentity) : async ResponseWithData<[StudentGrade]> {
    switch (_getStudentGrades(student)) {
      case (null) return _toResponseWithData(6, null);
      case (v) return _toResponseWithData(0, v);
    };
  };

  /**
   * Get the student's grade by name
   */
  public shared({caller}) func getStudentGrade(student : UserIdentity, gradeName : Text) : async ResponseWithData<StudentGrade> {
    switch (_getStudent(student)) {
      case (null) return _toResponseWithData(6, null);
      case (?student) {
        switch (_getStudentGrade(student, gradeName)) {
          case (null) return _toResponseWithData(7, null);
          case (v) return _toResponseWithData(0, v);
        };
      };
    };
  };

  /**
   * Get the student's subjects by grade name
   */
  public shared({caller}) func getStudentSubjects(student : UserIdentity, gradeName : Text) : async ResponseWithData<[StudentSubject]> {
    switch (_getStudent(student)) {
      case (null) return _toResponseWithData(6, null);
      case (?student) {
        switch (_getStudentSubjects(student, gradeName)) {
          case (null) return _toResponseWithData(7, null);
          case (v) return _toResponseWithData(0, v);
        };
      };
    };
  };

  /**
   * Update the student's subjects by grade name
   */
  public shared({caller}) func updateStudentSubjects(studentIdentity : UserIdentity, gradeName : Text, subjects : [StudentSubject]) : async Response {
    if (not _isOwner(caller)) {
      return _toResponse(1);
    };
    let _ : Bool = _addStudent(studentIdentity); // Add student if does not exist
    let student : Student = _optionalBreak(_getStudent(studentIdentity));
    let checkedStudent : Student = _addStudentGradeIfNotFound(student, gradeName, caller);
    let studentGrade : StudentGrade = _optionalBreak(_getStudentGrade(checkedStudent, gradeName));
    let newStudent : Student = _updateStudentSubjects(checkedStudent, gradeName, subjects);
    _replaceStudent(studentIdentity, newStudent);
    _addStudentToLog(studentIdentity, _optional(checkedStudent), newStudent, caller);
    return _toResponse(0);
  };

  /**
   * Get the student log of a student
   */
  public shared({caller}) func getStudentLog(student : UserIdentity) : async ResponseWithData<[StudentLog]> {
    return _toResponseWithData(0, _optional(_getStudentLog(student)));
  };
};
