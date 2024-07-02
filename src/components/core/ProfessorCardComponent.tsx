import React from 'react';

import { type Evaluation, type EvaluationData } from '~/models/Evaluation';
import GradeDialComponent from './GradeDialComponent';

interface ProfessorCardProps {
  evaluations: Evaluation[];
}

/*
const gradeOptions = ['Not Specified', 'A', 'B', 'C', 'D', 'F', 'Withdrew'];
const ratingOptions = ['Not Specified', 'Good', 'OK', 'Poor'];
const notesOptions = ['Not Specified', 'Few/None', 'Moderate', 'Overkill'];
const difficultyOptions = ['Not Specified', 'Easy', 'Moderate', 'Difficult'];
*/

const calculateAverage = (evaluations: Evaluation[], field: keyof EvaluationData): number => {
  const validValues = evaluations
    .map((evaluation) => JSON.parse(evaluation.EvaluationData)[field])
    .filter((value) => value !== 0 && value !== 6);
  console.log(field, validValues);
  if (validValues.length === 0) return 0;

  const total = validValues.reduce((acc, value) => acc + value, 0);
  return total / validValues.length;
};

const ProfessorCardComponent: React.FC<ProfessorCardProps> = ({ evaluations }) => {
  if (evaluations.length === 0) return null;

  const { FName, LName, Subject, CourseTitle } = evaluations[0];

  const avgOverallRating = calculateAverage(evaluations, 'o');
  const avgDifficulty = calculateAverage(evaluations, 'd');
  const avgGrade = calculateAverage(evaluations, 'g');
  const avgNotes = calculateAverage(evaluations, 'n');

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
              <GradeDialComponent value={avgGrade.toFixed(2)} label="Grade Received (Average)" />
            </div>
            <div>
              <GradeDialComponent value={avgOverallRating.toFixed(2)} label="Overall Rating (Average)" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <GradeDialComponent
                borderClass="border-t"
                value={avgDifficulty.toFixed(2)}
                label="Course Difficulty (Average)"
              />
            </div>
            <div>
              <GradeDialComponent
                borderClass="border-t"
                value={avgNotes.toFixed(2)}
                label="Quantity of Notes (Average)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorCardComponent;
