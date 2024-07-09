export type StepComponentProps = {
  step: 1 | 2 | 3 | 4;
  stepItems: string[];
};

export default ({ step, stepItems }: StepComponentProps) => {
  return (
    <div className="mx-auto px-4 md:px-0">
      <ul aria-label="Steps" className="items-center text-gray-600 font-medium md:flex">
        {stepItems.map((item, idx) => (
          <li
            aria-current={step == idx + 1 ? 'step' : false}
            className="flex-1 last:flex-none flex gap-x-2 md:items-center"
          >
            <div className="flex items-center flex-col gap-x-2">
              <div
                className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${step > idx + 1 ? 'bg-pe-blue pe-blue' : '' || step == idx + 1 ? 'border-pe-blue' : ''}`}
              >
                <span className={` ${step > idx + 1 ? 'hidden' : '' || step == idx + 1 ? 'text-pe-blue' : ''}`}>
                  {idx + 1}
                </span>
                {step > idx + 1 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="h-8 flex items-center md:h-auto">
              <h3 className={`text-sm ${step == idx + 1 ? 'text-pe-blue' : ''}`}>{item}</h3>
            </div>
            <hr
              className={`hidden mr-2 w-full border md:block ${idx + 1 == stepItems.length ? 'hidden' : '' || step > idx + 1 ? 'border-pe-blue' : ''}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
