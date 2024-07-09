export class Professor {
  id: number;
  schoolId: number;
  lName: string;
  lNameChar: string;
  fName: string;
  subjects: string;
  evaluationCount: number;
  overall: number;

  constructor(
    ID: number,
    SchoolID: number,
    LName: string,
    lNameChar: string,
    FName: string,
    Subjects: string,
    EvaluationCount: number,
    Overall: number
  ) {
    this.id = ID;
    this.schoolId = SchoolID;
    this.lName = LName;
    this.lNameChar = lNameChar;
    this.fName = FName;
    this.subjects = Subjects;
    this.evaluationCount = EvaluationCount;
    this.overall = Overall;
  }

  static fromRaw(raw: any): Professor {
    if (raw) {
      return new Professor(
        raw.id,
        raw.schoolId,
        raw.lName,
        raw.lNameChar,
        raw.fName,
        raw.subjects,
        raw.evaluationCount,
        raw.overall
      );
    } else {
      return new Professor(0, 0, '', '', '', '', 0, 0);
    }
  }
}
