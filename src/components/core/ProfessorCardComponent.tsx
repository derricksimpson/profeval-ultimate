import React from 'react';

import { type Evaluation, type EvaluationData } from '~/models/Evaluation';
import UltimateDialComponent from './UltimateDialComponent';
import type { Professor } from '~/models/Professor';
import Chip from '../ChipComponent';
import type { StringLiteral } from 'typescript';

/*
const gradeOptions = ['Not Specified', 'A', 'B', 'C', 'D', 'F', 'Withdrew'];
const ratingOptions = ['Not Specified', 'Good', 'OK', 'Poor'];
const notesOptions = ['Not Specified', 'Few/None', 'Moderate', 'Overkill'];
const difficultyOptions = ['Not Specified', 'Easy', 'Moderate', 'Difficult'];
*/


const tagFullNames = {
  tf: "True/False",
  mc: "Multiple Choice",
  m: "Matching",
  fitb: "Fill in the Blank",
  e: "Essays",
  ps: "Problem Solving",
  mf: "Mandatory Final",
  cf: "Cumulative Final",
  tb: "Textbook Required",
  ec: "Extra Credit",
  at: "Attendance Required"
};


interface AverageScale {
  field: string;
  percentage: number;
  textValue: string;
  value: number;
}

const gradeMapping = {
  1: 4, // A
  2: 3, // B
  3: 2, // C
  4: 1, // D
  5: 0, // F
};

const getGrade = (grade: number): AverageScale => {
  let textValue;
  if (grade >= 3.5) {
    textValue = 'A';
  } else if (grade >= 2.5) {
    textValue = 'B';
  } else if (grade >= 1.5) {
    textValue = 'C';
  } else if (grade >= 0.5) {
    textValue = 'D';
  } else {
    textValue = 'F';
  }

  // Calculate the percentage as per the 0-4 scale
  const percentage = (grade / 4) * 100;

  return {
    field: 'grade',
    value: grade,
    percentage: percentage,
    textValue: textValue,
  };
};

const getOverall = (overall: number): AverageScale => {
  let textValue;
  if (overall <= 1.2) {
    textValue = 'Good';
  } else if (overall > 1.2 && overall <= 2.2) {
    textValue = 'OK';
  } else if (overall > 2) {
    textValue = 'Poor';
  }
  return {
    field: 'overallRating',
    value: overall,
    percentage: ((3 - overall) / 2) * 100,
    textValue: textValue,
  };
};

const getNotes = (notes: number): AverageScale => {
  let textValue;
  if (notes > 2) {
    textValue = 'Overkill';
  } else if (notes >= 1 && notes <= 2) {
    textValue = 'Moderate';
  } else if (notes > 0 && notes < 1) {
    textValue = 'Not Specified';
  }

  return {
    field: 'notes',
    value: notes,
    percentage: (notes / 3) * 100,
    textValue: textValue,
  };
};

const getDifficulty = (difficulty: number): AverageScale => {
  let textValue;

  if (difficulty > 2 && difficulty <= 3) {
    textValue = 'Difficult';
  } else if (difficulty > 1 && difficulty <= 2) {
    textValue = 'Moderate';
  } else if (difficulty > 0 && difficulty <= 1) {
    textValue = 'Easy';
  } else {
    textValue = 'Not Specified';
  }

  return {
    field: 'difficulty',
    value: difficulty,
    percentage: (difficulty / 3) * 100,
    textValue: textValue,
  };
};



const calculateAverage = (evaluations: Evaluation[], field: keyof EvaluationData): number => {
  let validValues = evaluations
    .map((evaluation) => JSON.parse(evaluation.EvaluationData)[field])
    .filter((value) => value !== 0 && value !== 6);

  // invert the grade values - since this is wacky
  if (field === 'g') {
    validValues = validValues.map((value) => gradeMapping[value]);
  }

  if (validValues.length === 0) return 0;

  const total = validValues.reduce((acc, value) => acc + value, 0);
  const average = total / validValues.length;

  return average;
};

const getAverageScale = (evaluations: Evaluation[], field: keyof EvaluationData): AverageScale => {
  const averageValue = calculateAverage(evaluations, field);
  switch (field) {
    case 'g':
      return getGrade(averageValue);
    case 'o':
      return getOverall(averageValue);
    case 'n':
      return getNotes(averageValue);
    case 'd':
      return getDifficulty(averageValue);
    default:
      return {
        field: field as string,
        value: -1,
        percentage: -1,
        textValue: 'Not Specified',
      };
  }
};

interface ProfessorCardProps {
  evaluations: Evaluation[];
  professor: Professor;
  schoolId: string;
}

const ProfessorCardComponent: React.FC<ProfessorCardProps> = ({ professor, evaluations, schoolId }: ProfessorCardProps) => {
  if (evaluations.length === 0) return null;

  const calculateTagCounts = () => {
    const counts = {
      tf: 0, mc: 0, m: 0, fitb: 0, e: 0, ps: 0, mf: 0, cf: 0, tb: 0, ec: 0, at: 0
    };

    evaluations.forEach(evaluation => {
      const evalData: EvaluationData = JSON.parse(evaluation.EvaluationData);
      Object.keys(counts).forEach(key => {
        if (evalData[key] === 1) counts[key]++;
      });
    });

    return counts;
  };

  const tagCounts = calculateTagCounts();

  //const { FName, LName, Subject, CourseTitle } = evaluations[0];

  const averageGrade = getAverageScale(evaluations, 'g');
  const averageOverall = getAverageScale(evaluations, 'o');
  const averageNotes = getAverageScale(evaluations, 'n');
  const averageDifficulty = getAverageScale(evaluations, 'd');

  return (
    <div className="p-6 bg-white dark:bg-gray-900 mb-6">
      <div className="flex flex-col md:flex-row mb-4">
        <div className="md:w-1/4 p-4 flex flex-col items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${professor.fName}+${professor.lName}&background=0D8ABC&color=fff&size=196`}
            alt={`${professor.fName} ${professor.lName}`}
            className="rounded-full w-24 h-24 mb-4"
          />
          <p className="text-center text-lg font-semibold">
            {professor.fName} {professor.lName}
          </p>
          <p className="text-center text-sm text-gray-500">{professor.subjects}</p>
          <a href={`/evaluate?professorId=${professor.id}&schoolId=${schoolId}`} className="btn-secondary text-small">Add your Evaluation </a>
        </div>
        <div className="md:w-3/4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <UltimateDialComponent
                textValue={averageOverall.textValue}
                value={averageOverall.value}
                percentage={averageOverall.percentage}
                label="Overall Rating"
              />
            </div>
            <div>
              <UltimateDialComponent
                textValue={averageGrade.textValue}
                value={averageGrade.value}
                percentage={averageGrade.percentage}
                label="Grade Received"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <UltimateDialComponent
                borderClass="border-t"
                invert
                value={averageDifficulty.value}
                textValue={averageDifficulty.textValue}
                percentage={averageDifficulty.percentage}
                label="Course Difficulty"
              />
            </div>
            <div>
              <UltimateDialComponent
                borderClass="border-t"
                invert
                value={averageNotes.value}
                textValue={averageNotes.textValue}
                percentage={averageNotes.percentage}
                label="Quantity of Notes"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Tag Summary:</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(tagCounts).map(([key, count]) => (
            count > 0 && <Chip key={key} label={`${tagFullNames[key]}: ${count}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessorCardComponent;
