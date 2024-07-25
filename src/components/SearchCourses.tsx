import React, { useState, useEffect } from 'react';
import type { Professor } from '~/models/Professor';

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
  //handleSearch: (searchSubject: string, searchCourseNumber: string, searchProfessorLastName: string, page: number) => void;
  initialSubject?: string;
  initialCourseNumber?: string;
  initialProfessorLastName?: string;
}

const SearchCourses: React.FC<SearchCoursesProps> = ({
  context,
  schoolId,
  courseSubjects,
  onSearchResults,
  initialSubject = '',
  initialCourseNumber = '',
  initialProfessorLastName = '',
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
    <div className="mt-4">
      <h2 className="mt-6 font-bold">Search By Department</h2>
      <div className="mt-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <label className="w-32">Department:</label>
            <select
              className="flex-1 p-2 border border-gray-200"
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
              className="flex-1 p-2 border border-gray-200"
              value={courseNumber}
              onChange={(e) => setCourseNumber(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-32">Professor Last Name:</label>
            <input
              type="text"
              name="professorLastName"
              placeholder="Professor Last Name"
              className="flex-1 p-2 border border-gray-200"
              value={professorLastName}
              onChange={(e) => setProfessorLastName(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div className="flex justify-end">
            <button className="btn-primary p-2-4 ml-2 border border-gray-200" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCourses;
