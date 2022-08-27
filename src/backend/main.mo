import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Random "mo:base/Random";
import Blob "mo:base/Blob";

actor EduBlock {
  private type HashMap<K, V> = HashMap.HashMap<K, V>;

  private type StudentSubject = {
    name : Text;
    firstHalfScore : Float;
    secondHalfScore : Float;
    finalScore : Float;
    resitScore : Float;
    teacherName : Text;
  };

  private type StudentRecord = {
    subjects : [StudentSubject];
    image : Text;
    fullName : Text;
    school : Text;
    grade : Nat;
  };

  private let maxIdPool : Nat8 = 64;
  private let seed : Blob = Blob.fromArray([0xDE, 0xAD, 0xBE, 0xEF]);

  /**
   * The map of token texts to student records
   */
  private stable var studentEntries : [(Text, StudentRecord)] = [];
  private let students : HashMap<Text, StudentRecord> = HashMap.fromIter(studentEntries.vals(), 1, Text.equal, Text.hash);

  system func preupgrade() {
    studentEntries := Iter.toArray(students.entries());
  };

  system func postupgrade() {
    studentEntries := [];
  };

  public func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  private func _getStudentRecord(id : Text) : ?StudentRecord {
    return students.get(id);
  };

  private func _containsStudent(id : Text) : Bool {
    switch (_getStudentRecord(id)) {
      case (null) return false;
      case (_) return true;
    };
  };

  private func _generateId() : Text {
    return Nat.toText(Random.rangeFrom(maxIdPool, seed));
  };

  private func _generateUniqueId() : Text {
    var id : Text = "0";
    loop {
      id := _generateId();
    } while (_containsStudent(id));
    return id;
  };

  public func addStudentRecord(studentRecord : StudentRecord) : async Text {
    let id : Text = _generateUniqueId();
    students.put(id, studentRecord);
    return id;
  };

  public func getStudentRecord(id : Text) : async ?StudentRecord {
    return _getStudentRecord(id);
  };
};
