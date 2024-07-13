import React, { useEffect } from 'react';
import { type Evaluation, type EvaluationData } from '~/models/Evaluation';
import { BsEmojiSmile } from 'react-icons/bs';
import { BsEmojiNeutral } from 'react-icons/bs';
import { BsEmojiFrown } from 'react-icons/bs';
import { GoQuestion } from 'react-icons/go';

const gradeOptions = ['Not Specified', 'A', 'B', 'C', 'D', 'F', 'Withdrew'];
const ratingOptions = ['Not Specified', 'Good', 'OK', 'Poor'];
const notesOptions = ['Not Specified', 'Few/None', 'Moderate', 'Overkill'];
const difficultyOptions = ['Not Specified', 'Easy', 'Moderate', 'Difficult'];

const IconMap = [
  ,
  // leave the first element blank
  <BsEmojiSmile className="inline-block" />,
  <BsEmojiNeutral className="inline-block" />,
  <BsEmojiFrown className="inline-block" />,
];

type EvaluationSummaryProps = {
  evaluations: Evaluation[];
  evaluationId?: string;
};

const EvaluationSummaryComponent: React.FC<EvaluationSummaryProps> = ({
  evaluations,
  evaluationId,
}: EvaluationSummaryProps) => {
  const Icon = (overall) => {
    return IconMap[overall] || <GoQuestion />;
  };

  useEffect(() => {
    if (evaluationId) {
      setTimeout(() => {
        var elementToScrollTo = document.getElementById('evaluation_' + evaluationId);

        if (elementToScrollTo) {
          var elementPosition = elementToScrollTo.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.scrollY - 100;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 200);
    }
  }, [evaluationId]);

  return (
    <div className="p-6 bg-white">
      <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-4">{evaluations.length} Total Evaluations</h2>
      <div className="space-y-4">
        {evaluations.map((evaluation, idx) => {
          const evalData: EvaluationData = JSON.parse(evaluation.EvaluationData);

          return (
            <div
              key={idx}
              id={`evaluation_${evaluation.ID}`}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow"
            >
              <div className="flex justify-between items-center">
                <p className="text-md font-medium mb-2">
                  {evaluation.Subject}-{evaluation.CallNumber} : {evaluation.CourseTitle} -{' '}
                  <span className="font-normal">Posted on {evaluation.PostDate as any}</span>
                </p>
                <a href={`/evaluation/${evaluation.ID}`} className="btn-secondary font-bold py-2 px-4 rounded">
                  View Details
                </a>
              </div>
              <div className="mb-2">Tags</div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                <div>
                  <strong>Overall Rating:</strong> {Icon(evalData?.o)} {ratingOptions[evalData.o]}
                </div>
                <div>
                  <strong>Grade:</strong> {gradeOptions[evaluation.Grade]}
                </div>
                <div>
                  <strong>Quantity of Notes:</strong> {notesOptions[evalData.n]}
                </div>
                <div>
                  <strong>Difficulty:</strong> {difficultyOptions[evalData.d]}
                </div>
              </div>

              <div className=" dark:bg-gray-700  rounded-md">
                <h5>Comments:</h5>
                <p className="whitespace-pre-wrap">{evaluation.Comments}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvaluationSummaryComponent;
