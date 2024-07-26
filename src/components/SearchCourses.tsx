import React, { useState, useEffect } from 'react';
import type { Professor } from '~/models/Professor';
import LettersComponent from './core/LettersComponent';

export interface ProfsesorSearchResults {
  professors: Professor[];
  hasMore: boolean;
}

interface Subject {
  Subject: string;
}

interface SearchCoursesProps {
  context?: any;
  schoolId: number;
  courseSubjects: Subject[];
  onSearchResults: (professors: ProfsesorSearchResults) => void;
  initialSubject?: string;
  initialCourseNumber?: string;
  initialProfessorLastName?: string;
  schoolName: string;
  activeLetter?: string;
}

const SearchCourses: React.FC<SearchCoursesProps> = ({
  context,
  schoolId,
  courseSubjects,
  onSearchResults,
  initialSubject = '',
  initialCourseNumber = '',
  initialProfessorLastName = '',
  schoolName,
  activeLetter,
}) => {
  const [subject, setSubject] = useState(initialSubject);
  const [courseNumber, setCourseNumber] = useState(initialCourseNumber);
  const [professorLastName, setProfessorLastName] = useState(initialProfessorLastName);

  useEffect(() => {
    setSubject(initialSubject);
    setCourseNumber(initialCourseNumber);
    setProfessorLastName(initialProfessorLastName);
  }, [initialSubject, initialCourseNumber, initialProfessorLastName]);

  const handleSearch = async () => {
    const url = new URL('/api/evals', window.location.origin);

    url.searchParams.append('Subject', subject);
    url.searchParams.append('CurSchoolID', schoolId.toString());

    if (courseNumber) {
      url.searchParams.append('CallNumber', courseNumber);
    }

    if (professorLastName) {
      url.searchParams.append('LName', professorLastName);
    }

    try {
      const response = await fetch(url.toString());
      const data = await response.json();

      onSearchResults({
        hasMore: data.length > 25,
        professors: data.slice(0, 25),
      });

      // Update URL without redirecting
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('Subject', subject);
      newUrl.searchParams.set('CallNumber', courseNumber);
      newUrl.searchParams.set('LName', professorLastName);
      window.history.pushState({}, '', newUrl.pathname + newUrl.search);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Search By Department</h2>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <label className="w-32">Department:</label>
          <select
            className="flex-1 p-2 border border-gray-300 rounded-md"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">(Choose)</option>
            {courseSubjects?.map((row, index) => (
              <option key={index} value={row.Subject}>
                {row.Subject}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label className="w-32">Course Number:</label>
          <input
            type="text"
            name="courseNumber"
            placeholder="(optional)"
            className="flex-1 p-2 border border-gray-300 rounded-md"
            value={courseNumber}
            onChange={(e) => setCourseNumber(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-4">
            <label className="w-32">Last Name:</label>
            <input
              type="text"
              name="professorLastName"
              placeholder="Professor Last Name"
              className="flex-1 p-2 border border-gray-300 rounded-md"
              value={professorLastName}
              onChange={(e) => setProfessorLastName(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div className="ml-32 mt-2">
            <LettersComponent schoolId={String(schoolId)} schoolName={schoolName} activeLetter={activeLetter} />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn-primary p-2shadow-md" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchCourses;
