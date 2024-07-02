import React from 'react';
import { type Evaluation, type EvaluationData } from '~/models/Evaluation';

interface EvaluationSummaryProps {
  evaluations: Evaluation[];
}

const gradeOptions = ['Not Specified', 'A', 'B', 'C', 'D', 'F', 'Withdrew'];
const ratingOptions = ['Not Specified', 'Good', 'OK', 'Poor'];
const notesOptions = ['Not Specified', 'Few/None', 'Moderate', 'Overkill'];
const difficultyOptions = ['Not Specified', 'Easy', 'Moderate', 'Difficult'];

const EvaluationSummaryComponent: React.FC<EvaluationSummaryProps> = ({ evaluations }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mb-6">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Evaluation Summary</h3>
      <div className="space-y-4">
        {evaluations.map((evaluation, idx) => {
          const evalData: EvaluationData = JSON.parse(evaluation.EvaluationData);
          return (
            <div key={idx} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow">
              <p className="text-sm text-gray-500 dark:text-gray-400">Posted on: {evaluation.PostDate}</p>
              <p className="text-md font-medium">
                {evaluation.Subject}-{evaluation.CallNumber} : {evaluation.CourseTitle}
              </p>
              <p>
                <strong>Comments:</strong> {evaluation.Comments}
              </p>
              <p>
                <strong>Grade:</strong> {gradeOptions[evaluation.Grade]}
              </p>
              <p>
                <strong>Overall Rating:</strong> {ratingOptions[evalData.o]}
              </p>
              <p>
                <strong>Quantity of Notes:</strong> {notesOptions[evalData.n]}
              </p>
              <p>
                <strong>Difficulty:</strong> {difficultyOptions[evalData.d]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvaluationSummaryComponent;
