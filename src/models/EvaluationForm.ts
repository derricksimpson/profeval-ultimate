// models/EvaluationForm.ts
export interface EvaluationForm {
  firstName: string;
  lastName: string;
  subject: string;
  courseNumber: string;
  courseTitle: string;
  grade: string;
  overallRating: string;
  exams: {
    multipleChoice: boolean;
    matching: boolean;
    trueFalse: boolean;
    fillInTheBlank: boolean;
    essay: boolean;
    problemSolving: boolean;
    mandatoryFinal: boolean;
    cumulativeFinal: boolean;
  };
  otherInfo: {
    textbookRequired: boolean;
    extraCredit: boolean;
    attendanceMandatory: boolean;
    notesQuantity: string;
    courseDifficulty: string;
  };
  comments: string;
  spamProtection: string;
}

export const initialEvaluationForm: EvaluationForm = {
  firstName: '',
  lastName: '',
  subject: '',
  courseNumber: '',
  courseTitle: '',
  grade: '0',
  overallRating: '0',
  exams: {
    multipleChoice: false,
    matching: false,
    trueFalse: false,
    fillInTheBlank: false,
    essay: false,
    problemSolving: false,
    mandatoryFinal: false,
    cumulativeFinal: false,
  },
  otherInfo: {
    textbookRequired: false,
    extraCredit: false,
    attendanceMandatory: false,
    notesQuantity: '0',
    courseDifficulty: '0',
  },
  comments: '',
  spamProtection: '',
};
