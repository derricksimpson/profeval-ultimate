import React from 'react';

import { type Evaluation, type EvaluationData } from '~/models/Evaluation';
import UltimateDialComponent from './UltimateDialComponent';

interface ProfessorCardProps {
  evaluations: Evaluation[];
}

/*
const gradeOptions = ['Not Specified', 'A', 'B', 'C', 'D', 'F', 'Withdrew'];
const ratingOptions = ['Not Specified', 'Good', 'OK', 'Poor'];
const notesOptions = ['Not Specified', 'Few/None', 'Moderate', 'Overkill'];
const difficultyOptions = ['Not Specified', 'Easy', 'Moderate', 'Difficult'];
*/

interface AverageScale {
  field: string;
  percentage: number;
  value: string;
}

const gradeMapping = {
  1: 4, // A
  2: 3, // B
  3: 2, // C
  4: 1, // D
  5: 0, // F
};

const getGrade = (grade: number): AverageScale => {
  let value;
  if (grade >= 3.5) {
    value = 'A';
  } else if (grade >= 2.5) {
    value = 'B';
  } else if (grade >= 1.5) {
    value = 'C';
  } else if (grade >= 0.5) {
    value = 'D';
  } else {
    value = 'F';
  }

  // Calculate the percentage as per the 0-4 scale
  const percentage = (grade / 4) * 100;

  return {
    field: 'grade',
    percentage: percentage,
    value: value,
  };
};

const getOverall = (overall: number): AverageScale => {
  let label;
  if (overall <= 1) {
    label = 'Good';
  } else if (overall > 1 && overall <= 2) {
    label = 'OK';
  } else if (overall > 2) {
    label = 'Poor';
  }
  return {
    field: 'overallRating',
    percentage: ((3 - overall) / 2) * 100,
    value: label,
  };
};

const getNotes = (notes: number): AverageScale => {
  let label;
  if (notes > 2) {
    label = 'Overkill';
  } else if (notes > 1 && notes <= 2) {
    label = 'Moderate';
  } else {
    label = 'Few/None';
  }

  return {
    field: 'notes',
    percentage: (notes / 3) * 100,
    value: label,
  };
};

const getDifficulty = (difficulty: number): AverageScale => {
  let label;
  if (difficulty > 2 && difficulty <= 3) {
    label = 'Difficult';
  } else if (difficulty >= 1 && difficulty <= 2) {
    label = 'Moderate';
  } else if (difficulty === 1) {
    label = 'Easy';
  } else {
    label = 'Not Specified';
  }
  return {
    field: 'difficulty',
    percentage: (difficulty / 3) * 100,
    value: label,
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
        percentage: 0,
        value: 'Not Specified',
      };
  }
};
const ProfessorCardComponent: React.FC<ProfessorCardProps> = ({ evaluations }) => {
  if (evaluations.length === 0) return null;

  const { FName, LName, Subject, CourseTitle } = evaluations[0];

  const averageGrade = getAverageScale(evaluations, 'g');
  const averageOverall = getAverageScale(evaluations, 'o');
  const averageNotes = getAverageScale(evaluations, 'n');
  const averageDifficulty = getAverageScale(evaluations, 'd');

  return (
    <div className="p-6 bg-white dark:bg-gray-900 mb-6">
      <div className="flex flex-col md:flex-row mb-4">
        <div className="md:w-1/4 p-4 flex flex-col items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${FName}+${LName}&background=0D8ABC&color=fff&size=256`}
            alt={`${FName} ${LName}`}
            className="rounded-full w-24 h-24 mb-4"
          />
          <p className="text-center text-lg font-semibold">
            {FName} {LName}
          </p>
          <p className="text-center text-sm text-gray-500">{Subject}</p>
        </div>
        <div className="md:w-3/4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <UltimateDialComponent
                value={averageOverall.value}
                percentage={averageOverall.percentage}
                label="Overall Rating"
              />
            </div>
            <div>
              <UltimateDialComponent
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
                percentage={averageDifficulty.percentage}
                label="Course Difficulty"
              />
            </div>
            <div>
              <UltimateDialComponent
                borderClass="border-t"
                invert
                value={averageNotes.value}
                percentage={averageNotes.percentage}
                label="Quantity of Notes"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorCardComponent;
