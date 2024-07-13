export class EvaluationMap {
  public professorId: number;
  public lName: string;
  public fName: string;
  public schoolId: number;
  public schoolName: string;

  constructor(professorId: number, lName: string, fName: string, schoolId: number, schoolName: string) {
    this.professorId = professorId;
    this.lName = lName;
    this.fName = fName;
    this.schoolId = schoolId;
    this.schoolName = schoolName;
  }

  static fromRaw(raw: any): EvaluationMap {
    if (raw) {
      return new EvaluationMap(raw.professorId, raw.lName, raw.fName, raw.schoolId, raw.schoolName);
    } else {
      return null;
    }
  }

  // Method to create a URL-friendly string
  toUrlFriendlyString(str: string): string {
    if (str) {
      return str
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w-]+/g, '');
    } else {
      return undefined;
    }
  }

  urlFriendlySchoolName(): string {
    return this.toUrlFriendlyString(this.schoolName);
  }

  // Method to get the URL-friendly name
  urlFriendlyProfName(): string {
    return this.toUrlFriendlyString(`${this.fName}-${this.lName}`);
  }
}
