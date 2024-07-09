// models/Evaluation.ts
export interface EvaluationData {
  mc: number; // multiple choice
  m: number; // matching
  tf: number; // true/false
  fitb: number; // fill in the blank
  e: number; // essays
  ps: number; // problem solving
  mf: number; // mandatory final
  cf: number; // cumulative final
  tb: number; // textbook required
  ec: number; // extra credit
  at: number; // attendance required
  n: number; // notes 0 to 4 scale
  d: number; // difficulty 0 to 4 scale
  g: number; // grade 0 to 4 scale
  o: number; // overall rating 0 to 4 scale
}

export interface Evaluation {
  ID: number;
  SchoolID: number;
  Hidden: number;
  IP: string;
  PostDate: Date;
  FName: string;
  LName: string;
  Subject: string;
  CallNumber: string;
  CourseTitle: string;
  Grade: number;
  EvaluationData: string;
  Comments: string;
  ProfessorId: number;
}
