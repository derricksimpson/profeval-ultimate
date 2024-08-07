// components/EvaluationForm.tsx
import React, { useState, useEffect } from 'react';
import { type EvaluationForm, initialEvaluationForm } from '~/models/EvaluationForm';
import StepsComponent from '../StepsComponent';
import RadioButton from '../RadioButton';
import SchoolSelectorComponent from '../SchoolSelectorComponent';
import type { School } from '~/models/School';
import ProfessorSelectComponent from './ProfessorSelectComponent';
import type { Professor } from '~/models/Professor';

interface SectionHeaderProps {
  sectionLabel: string;
  subHeading?: string;
}

interface Subject {
  Subject: string;
}

const formConfig = {
  otherInfo: {
    textbookRequired: {
      options: ['Yes', 'No'],
      label: 'Textbook Required',
      span: 1,
    },
    extraCredit: {
      options: ['Yes', 'No'],
      label: 'Extra Credit Available',
      span: 1,
    },
    attendanceMandatory: {
      options: ['Yes', 'No'],
      label: 'Attendance Mandatory',
      span: 1,
    },
    notesQuantity: {
      options: ['Few/None', 'Moderate', 'Overkill'],
      label: 'Quantity of Notes',
      span: 3,
      optionSize: 9,
    },
    courseDifficulty: {
      options: ['Easy', 'Moderate', 'Difficult'],
      label: 'Difficulty of Course',
      span: 3,
      optionSize: 9,
    },
  },
};

// Define a type for the step
type Step = 1 | 2 | 3 | 4;

const EvaluationFormComponent = () => {
  let professor = (window as any).professor || {};

  if (professor) {
    initialEvaluationForm.professorId = professor.id;
    initialEvaluationForm.firstName = professor.fName;
    initialEvaluationForm.lastName = professor.lName;
  }

  const [formData, setFormData] = useState<EvaluationForm>(initialEvaluationForm);
  const [step, setStep] = useState<Step>(1);
  const [schoolId, setSchoolId] = useState<string>(localStorage.getItem('schoolId') || '');
  const [schoolName, setSchoolName] = useState<string>(localStorage.getItem('schoolName') || '');
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const nextStep = (step: Step) => {
    if (step < 1 || step > 4) return;
    setStep(step);
  };

  useEffect(() => {
    fetch('/api/subjects?schoolId=' + schoolId)
      .then((res) => res.json())
      .then((data) => setSubjects(data));
  }, [schoolId]);

  const onSchoolChange = (school: School) => {
    setSchoolId(school.ID.toString());
    setSchoolName(school.Name);
    localStorage.setItem('schoolId', school.ID.toString());
    localStorage.setItem('schoolName', school.Name);
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
      let newState = { ...prevState, [name]: value };

      return newState;
    });
  };

  const onSimpleChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [section, field] = name.split('.') as [keyof EvaluationForm, keyof EvaluationForm[keyof EvaluationForm]];
      setFormData((prevState) => {
        let newState = {
          ...prevState,
          [section]: {
            ...(prevState[section] as any),
            [field]: value,
          },
        };

        return newState;
      });
      return;
    }
    setFormData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  interface TextInputProps {
    name: string;
    value: string;
    onChange: Function;
    placeholder?: string;
    type?: string;
  }

  const TextInput: React.FC<TextInputProps> = React.memo(({ name, value, placeholder, onChange, type = 'text' }) => {
    const [localValue, setLocalValue] = useState(value);

    const handleBlur = () => {
      if (localValue !== value) {
        onChange(name, localValue);
      }
    };

    return (
      <input
        type={type}
        name={name}
        value={localValue}
        placeholder={placeholder}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
      />
    );
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const { checked } = e.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        exams: {
          ...prevState.exams,
          [key]: checked,
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit form data to the backend
  };

  const onProfessorSelected = (professor: Professor) => {
    let professorId = professor.id;
    setFormData((prevState) => {
      return { ...prevState, professorId };
    });
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
      <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center">
        <h2 className="text-2xl font-bold mb-6 flex-1">Post an Evaluation</h2>
      </div>

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
        setStep={nextStep}
        stepItems={['General Information', 'Exam Information', 'Course Information', 'Comments']}
      />

      {schoolId == '' && <SchoolSelectorComponent onSchoolChanged={onSchoolChange} />}

      {schoolName && (
        <h3 className="font-semibold mt-4 ">
          {schoolName} (
          <a
            className="underline text-blue-700"
            onClick={() => {
              setSchoolId('');
              setSchoolName('');
            }}
            href="#"
          >
            Switch School
          </a>
          )
        </h3>
      )}

      <div className={`${step == 1 ? '' : 'hidden'} grid grid-cols-1 md:grid-cols-3 gap-2 gap-y-6`}>
        {/* General Information Section */}
        <div className="col-span-3 border-b p-2"></div>

        <div className="col-span-3 md:col-span-1">
          <label className="block mb-2 text-gray-800 font-medium">
            Professor's <b className="text-black uppercase">Last</b> Name:
          </label>
          <ProfessorSelectComponent formData={formData} setFormData={setFormData} schoolId={schoolId} />
        </div>
        <div className="col-span-3 md:col-span-1">
          <label className="block mb-2 text-gray-800 font-medium">Professor's First Name:</label>
          <TextInput
            name="firstName"
            placeholder="Enter a first name"
            value={formData.firstName}
            onChange={onSimpleChange}
          />
        </div>
        <div className="col-span-3 md:col-span-1"></div>

        {/* Subject, Course Number, Course Title */}

        <div className="lg:col-span-1 pt-2">
          <label className="block mb-2 text-gray-800 font-medium">Subject Area:</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Choose One</option>
            {subjects && subjects.map((item) => <option value={item.Subject}>{item.Subject}</option>)}
          </select>
        </div>
        <div className="col-span-3 md:col-span-1 pt-2">
          <label className="block mb-2 text-gray-800 font-medium">Course Number:</label>
          <input
            type="text"
            name="courseNumber"
            value={formData.courseNumber}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          />{' '}
        </div>
        <div className="col-span-3 md:col-span-1 pt-2">
          <label className="block mb-2 text-gray-800 font-medium">Course Title:</label>
          <input
            type="text"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="col-span-3 lg:col-span-1 md:col-span-2">
          <RadioButton
            name="overallRating"
            onChange={onSimpleChange}
            label="Overall Rating"
            options={['Poor', 'OK', 'Good']}
            colors={['#AA0000', 'orange', 'blue']}
          />
        </div>
        <div className="col-span-3 lg:col-span-2">
          <RadioButton
            name="gradeReceived"
            onChange={onSimpleChange}
            label="Grade Received"
            options={['A', 'B', 'C', 'D', 'F', 'Withdrew']}
          />
        </div>
      </div>

      <div className={`${step == 2 ? '' : 'hidden'} grid grid-cols-1 md:grid-cols-3 gap-2 gap-y-6`}>
        <div className="col-span-3 border-b p-2"></div>

        {Object.keys(formData.exams).map((key) => (
          <div className="col-span-3 md:col-span-1" key={key}>
            <RadioButton
              name={`exams.${key}`}
              onChange={onSimpleChange}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              options={['Yes', 'No']}
            />{' '}
          </div>
        ))}
      </div>

      <div className={`${step == 3 ? '' : 'hidden'} grid grid-cols-1 md:grid-cols-3 gap-2 gap-y-6`}>
        <div className="col-span-3 border-b p-2"></div>

        {/* Course Information */}
        {Object.keys(formConfig.otherInfo).map((key) => {
          let item = formConfig.otherInfo[key];
          return (
            <div className={`col-span-3 md:col-span-${item.span}`}>
              <RadioButton
                name={`otherInfo.${key}`}
                onChange={onSimpleChange}
                label={item.label}
                width={item.optionSize}
                options={item.options}
              />
            </div>
          );
        })}

        {/* Grade and Overall Rating */}
      </div>

      <div className={`${step == 4 ? '' : 'hidden'} grid grid-cols-1 md:grid-cols-3 gap-2 gap-y-6`}>
        {/* Comments Section */}
        <div className="col-span-3 border-b p-2"></div>

        <div className="col-span-1 md:col-span-3">
          <label className="block mb-2 text-gray-800 font-medium">
            Please provide any additional details about this course that you feel may be important to other students.{' '}
            <b>Please do not leave this field blank, as it is often the most useful information.</b>
          </label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="w-full h-44 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
      <div className="mt-6 text-right">
        <div id="example-container"></div>
      </div>

      <div className="mt-6 text-right">
        {step > 1 && <input
          type="button"
          value="Previous"
          onClick={() => {
            nextStep((step - 1) as Step);
          }}
          className="px-6 py-2 bg-gray-600 text-white font-semiboldshadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 dark:bg-orange-400 dark:hover:bg-orange-500"
        />
        }
        {step < 4 && (
          <>
            <input
              type="button"
              value="Next"
              onClick={() => {
                nextStep((step + 1) as Step);
              }}
              className="px-6 ml-2 py-2 bg-orange-600 text-white font-semibold shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50 dark:bg-orange-400 dark:hover:bg-orange-500"
            />
          </>
        )}
        {step == 4 && (
          <button
            type="submit"
            className="px-6 ml-2 py-2 bg-orange-600 text-white font-semibold shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50 dark:bg-orange-400 dark:hover:bg-orange-500"
          >
            Post Evaluation
          </button>
        )}
      </div>
    </form>
  );
};

export default EvaluationFormComponent;
