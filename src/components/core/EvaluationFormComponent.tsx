// components/EvaluationForm.tsx
import { useState, useEffect } from 'react';
import { type EvaluationForm, initialEvaluationForm } from '~/models/EvaluationForm';
import StepsComponent from '../StepsComponent';

interface SectionHeaderProps {
  sectionLabel: string;
  subHeading?: string;
}

const SectionHeader = ({ sectionLabel, subHeading }: SectionHeaderProps) => {
  return (
    <div className="items-start justify-between py-4 border-b mb-3">
      <h3 className="text-xl font-semibold mb">{sectionLabel}</h3>
      {subHeading && <p className="text-gray-600 mt-2">subHeading</p>}
    </div>
  );
};
// Define a type for the step
type Step = 1 | 2 | 3 | 4;

const EvaluationFormComponent = () => {
  const [formData, setFormData] = useState<EvaluationForm>(initialEvaluationForm);
  const [step, setStep] = useState<Step>(1);

  const nextStep = (step: Step) => {
    if (step < 1 || step > 4) return;
    setStep(step);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, selected } = e.target as any;
    setFormData((prevState) => {
      if (type === 'checkbox') {
        const section = name.split('.')[0] as keyof EvaluationForm;
        const field = name.split('.')[1] as keyof (typeof prevState)[typeof section];
        return {
          ...prevState,
          [section]: {
            ...(prevState[section] as any),
            [field]: selected,
          },
        };
      }
      return { ...prevState, [name]: value };
    });
  };

  const TextInput = ({ name, value, onChange, type = 'text' }) => {
    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
      />
    );
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit form data to the backend
  };

  useEffect(() => {
    // Fetch backend data if needed and set initial form state
    // Example: fetch('/api/form-data').then(res => res.json()).then(data => setFormData(data));
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto mt-4 mb-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Post an Evaluation</h2>
      {/* <p className="mb-6">
        The following form is broken into four easily digestible sections. Please take the time to fill out the form as
        completely as possible. The more relevant and accurate information you provide, the more useful it is to other
        students. Before posting an evaluation, we recommend you read the{' '}
        <a
          href="#"
          className="text-orange-600 dark:text-orange-400 underline"
          onClick={() => window.open('help.html#Guidelines', 'Help')}
        >
          Posting Guidelines
        </a>
        .
      </p> */}

      <StepsComponent
        step={step}
        stepItems={['General Information', 'Exam Information', 'Instructor Information', 'Comments']}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {step == 1 && (
          <>
            {/* General Information Section */}
            <div className="col-span-3">
              <SectionHeader sectionLabel="General Information" />
            </div>

            {/* Professor's Name */}
            <div className="col-span-3 lg:col-span-1">
              <label className="block mb-2">
                Professor's <b>Last Name</b>:
              </label>
              <TextInput name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="col-span-3 lg:col-span-1">
              <label className="block mb-2">Professor's First Name:</label>
              <TextInput name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="col-span-3 lg:col-span-1"></div>

            {/* Subject, Course Number, Course Title */}

            <div className="lg:col-span-1 pt-2">
              <label className="block mb-2">Subject Area:</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Choose One</option>
                {/* Add options dynamically */}
              </select>
            </div>
            <div className="col-span-3 lg:col-span-1 pt-2">
              <label className="block mb-2">Course Number:</label>
              <input
                type="text"
                name="courseNumber"
                value={formData.courseNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />{' '}
            </div>
            <div className="col-span-3 lg:col-span-1 pt-2">
              <label className="block mb-2">Course Title:</label>
              <input
                type="text"
                name="courseTitle"
                value={formData.courseTitle}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            {/* Grade and Overall Rating */}
            <div className="lg:col-span-1">
              <label className="block mb-2">Grade You Received:</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="0">Not Specified</option>
                <option value="1">A</option>
                <option value="2">B</option>
                <option value="3">C</option>
                <option value="4">D</option>
                <option value="5">F</option>
                <option value="6">Withdrew</option>
              </select>
            </div>
            <div className="col-span-3 lg:col-span-1">
              <label className="block mb-2">Overall Rating:</label>
              <select
                name="overall"
                value={formData.overallRating}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="1">Poor</option>
                <option value="2">OK</option>
                <option value="3">Good</option>
              </select>
            </div>
          </>
        )}

        {/* Exam Information Section */}
        {step == 2 && (
          <>
            <div className="col-span-2">
              <SectionHeader sectionLabel="Exam Information" />
            </div>

            {Object.keys(formData.exams).map((key) => (
              <div key={key}>
                <input
                  type="checkbox"
                  id={`checkbox-${key}`}
                  name={`checkbox-${key}`}
                  className="checkbox-item peer hidden"
                  checked={formData.exams[key]}
                  onChange={(e) => handleCheckboxChange(e, key)}
                />
                <label
                  htmlFor={`checkbox-${key}`}
                  className="relative flex w-5 h-5 bg-white peer-checked:bg-blue-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                ></label>
                <label className="block mb-2">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                </label>
              </div>
            ))}
          </>
        )}

        {step == 3 && (
          <>
            {/* Instructor Information Section */}
            {/* Other Information Section */}
            <div className="col-span-1 md:col-span-2 mt-6">
              <h3 className="text-xl font-semibold mb-2">Other Information</h3>
              <hr className="border-orange-600 dark:border-orange-400 mb-4" />
            </div>
            {Object.keys(formData.otherInfo).map((key) => (
              <div key={key}>
                <label className="block mb-2">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                </label>
                <div className="flex space-x-4">
                  <label>
                    <input
                      type="checkbox"
                      name={`otherInfo.${key}`}
                      checked={formData.otherInfo[key]}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Yes
                  </label>
                </div>
              </div>
            ))}
          </>
        )}

        {step == 4 && (
          <>
            {/* Additional Information Section */}
            <div className="col-span-1 md:col-span-3 mt-6">
              <SectionHeader sectionLabel="Comments" />
            </div>
            <div className="col-span-1 md:col-span-3">
              <label className="block mb-2">
                Please provide any additional details about this course that you feel may be important to other
                students. <b>Please do not leave this field blank, as it is often the most useful information.</b>
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </>
        )}
      </div>
      <div className="mt-6 text-right">
        <input
          type="button"
          value="Previous"
          onClick={() => {
            nextStep((step - 1) as Step);
          }}
          className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 dark:bg-orange-400 dark:hover:bg-orange-500"
        />

        <input
          type="button"
          value="Next"
          onClick={() => {
            nextStep((step + 1) as Step);
          }}
          className="px-6 ml-2 py-2 bg-orange-600 text-white font-semibold rounded-md shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50 dark:bg-orange-400 dark:hover:bg-orange-500"
        />

        {/* <button
          type="submit"
          className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-md shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50 dark:bg-orange-400 dark:hover:bg-orange-500"
        >
          Post
        </button> */}
      </div>
    </form>
  );
};

export default EvaluationFormComponent;
