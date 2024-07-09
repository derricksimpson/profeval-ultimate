import React from 'react';

export type StepComponentProps = {
  step: 1 | 2 | 3 | 4;
  stepItems: string[];
};

export default ({ step, stepItems }: StepComponentProps) => {
  return (
    <div className="mx-auto px-4 md:px-0">
      <ul
        aria-label="Steps"
        className="flex flex-col md:flex-row items-start md:items-center text-gray-600 font-medium"
      >
        {stepItems.map((item, idx) => (
          <li
            key={idx}
            aria-current={step == idx + 1 ? 'step' : false}
            className="flex-1 w-auto md:w-auto gap-x-2  md:mb-0"
          >
            <div className="flex items-center w-full">
              <div
                className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${
                  step > idx + 1 ? 'bg-pe-blue border-pe-blue' : step == idx + 1 ? 'border-pe-blue' : ''
                }`}
              >
                <span className={step > idx + 1 ? 'hidden' : step == idx + 1 ? 'text-pe-blue border-b-pe-blue' : ''}>
                  {idx + 1}
                </span>
                {step > idx + 1 && (
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <div className="flex-grow">
                <h3 className={`text-sm ${step == idx + 1 ? 'text-pe-blue' : ''}`}>{item}</h3>
              </div>
            </div>
            {idx < stepItems.length - 1 && (
              <hr className={`hidden md:block w-full md:w-8 border ${step > idx + 1 ? 'border-pe-blue' : ''}`} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
