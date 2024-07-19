import React, { useEffect } from 'react';
import { type Evaluation, type EvaluationData } from '~/models/Evaluation';
import Chip from '../ChipComponent';

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
  schoolId: string;
  professorId: string;
};

const getChipColors = (category: string, value: number) => {
  const defaultColors = { color: 'bg-gray-200', textColor: 'text-gray-800' };

  const colorMaps = {
    rating: [
      defaultColors,
      { color: 'bg-green-500', textColor: 'text-white' },
      { color: 'bg-yellow-400', textColor: 'text-gray-800' },
      { color: 'bg-red-500', textColor: 'text-white' },
    ],
    grade: [
      defaultColors,
      { color: 'bg-green-500', textColor: 'text-white' },
      { color: 'bg-green-400', textColor: 'text-white' },
      { color: 'bg-yellow-400', textColor: 'text-gray-800' },
      { color: 'bg-orange-500', textColor: 'text-white' },
      { color: 'bg-red-500', textColor: 'text-white' },
      { color: 'bg-gray-500', textColor: 'text-white' },
    ],
    notes: [
      defaultColors,
      { color: 'bg-green-500', textColor: 'text-white' },
      { color: 'bg-yellow-400', textColor: 'text-gray-800' },
      { color: 'bg-red-500', textColor: 'text-white' },
    ],
    difficulty: [
      defaultColors,
      { color: 'bg-green-500', textColor: 'text-white' },
      { color: 'bg-yellow-400', textColor: 'text-gray-800' },
      { color: 'bg-red-500', textColor: 'text-white' },
    ],
  };

  return colorMaps[category][value] || defaultColors;
};

const EvaluationSummaryComponent: React.FC<EvaluationSummaryProps> = ({
  evaluations,
  evaluationId,
  schoolId,
  professorId,
}: EvaluationSummaryProps) => {


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
                  {evaluation.Subject}-{evaluation.CallNumber} : {evaluation.CourseTitle}{'   '}
                  - {'   '}
                  <span className="font-normal">Posted {new Date(evaluation.PostDate).toLocaleDateString('en-US')}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                <div>
                  <strong>Overall Rating:</strong>{' '}
                  <Chip
                    label={ratingOptions[evalData.o]}
                    {...getChipColors('rating', evalData.o)}
                  />
                </div>
                <div>
                  <strong>Grade:</strong>{' '}
                  <Chip
                    label={gradeOptions[evaluation.Grade]}
                    {...getChipColors('grade', evaluation.Grade)}
                  />
                </div>
                <div>
                  <strong>Quantity of Notes:</strong>{' '}
                  <Chip
                    label={notesOptions[evalData.n]}
                    {...getChipColors('notes', evalData.n)}
                  />
                </div>
                <div>
                  <strong>Difficulty:</strong>{' '}
                  <Chip
                    label={difficultyOptions[evalData.d]}
                    {...getChipColors('difficulty', evalData.d)}
                  />
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
      <div className="mt-2">
        <a href={`/evaluate?professorId=${professorId}&schoolId=${schoolId}`} className="btn-secondary text-small">Post your own Evaluation </a>
      </div>
    </div>
  );
};

export default EvaluationSummaryComponent;