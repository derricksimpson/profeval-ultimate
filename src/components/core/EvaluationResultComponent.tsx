// components/EvaluationResult.tsx
import React from 'react';
import { type Evaluation, type EvaluationData } from '../../models/Evaluation';

interface EvaluationResultProps {
  evaluation: Evaluation;
}

const decodeEvaluationData = (evaluation: string): EvaluationData => JSON.parse(evaluation);

const EvaluationResultComponent: React.FC<EvaluationResultProps> = ({ evaluation }) => {
  const evalData = decodeEvaluationData(evaluation.EvaluationData);

  evaluation.Comments = evaluation.Comments.replaceAll('<BR>', '\n');

  const gradeOptions = ['Not Specified', 'A', 'B', 'C', 'D', 'F', 'Withdrew'];
  const ratingOptions = ['Not Specified', 'Good', 'OK', 'Poor'];
  const notesOptions = ['Not Specified', 'Few/None', 'Moderate', 'Overkill'];
  const difficultyOptions = ['Not Specified', 'Easy', 'Moderate', 'Difficult'];

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row mb-4">
        <div className="md:w-1/4 p-4  flex flex-col items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${evaluation.FName}+${evaluation.LName}&background=0D8ABC&color=fff`}
            alt={`${evaluation.FName} ${evaluation.LName}`}
            className="rounded-full mx-auto mb-4"
          />
          <p className="text-center text-lg font-semibold">
            {evaluation.FName} {evaluation.LName}
          </p>
          <p className="text-center text-sm text-gray-500">
            {evaluation.Subject} - {evaluation.CourseTitle}
          </p>
          <p className="text-center text-sm text-gray-500">Posted on: {`${evaluation.PostDate}`}</p>
        </div>
        <div className="md:w-3/4 p-4">
          <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
            {evaluation.CourseTitle} - {evaluation.Subject}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p>
                <strong>Grade Received:</strong> {gradeOptions[evaluation.Grade]}
              </p>
            </div>
            <div>
              <p>
                <strong>Overall Rating:</strong> {ratingOptions[evalData.o]}
              </p>
            </div>
          </div>
          <h4 className="text-xl font-semibold mb-2">Evaluation Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>
                <strong>Multiple Choice:</strong> {evalData.mc ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Matching:</strong> {evalData.m ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>True/False:</strong> {evalData.tf ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Fill in the Blank:</strong> {evalData.fitb ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Essay:</strong> {evalData.e ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <p>
                <strong>Problem Solving:</strong> {evalData.ps ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Mandatory Final:</strong> {evalData.mf ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Cumulative Final:</strong> {evalData.cf ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Textbook Required:</strong> {evalData.tb ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Extra Credit:</strong> {evalData.ec ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <p>
                <strong>Attendance Mandatory:</strong> {evalData.at ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Quantity of Notes:</strong> {notesOptions[evalData.n]}
              </p>
              <p>
                <strong>Difficulty of Course:</strong> {difficultyOptions[evalData.d]}
              </p>
              <p>
                <strong>Overall Rating:</strong> {ratingOptions[evalData.o]}
              </p>
            </div>
          </div>

          <div>
            <p>
              <strong>Comments:</strong> {evaluation.Comments}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationResultComponent;
