import React, { useState } from 'react';
import type { Professor } from '~/models/Professor';

interface Subject {
  Subject: string;
}

interface SearchCoursesProps {
  context?: any;
  schoolId: number;
  courseSubjects: Subject[];
  onSearchResults: (professors: Professor[]) => void;
  callNumber?: string;
  lastName?: string;
}

const SearchCourses: React.FC<SearchCoursesProps> = ({
  context,
  schoolId,
  courseSubjects,
  callNumber,
  lastName,
  onSearchResults,
}) => {
  const [subject, setSubject] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [professorLastName, setProfessorLastName] = useState('');
  const [showCustomCourse, setShowCustomCourse] = useState(false); // allow users to enter their own course if none are here

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

      onSearchResults(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="mt-6 font-bold">Search By Department</h2>
      <div className="mt-4">
        <div style={{ position: 'relative' }}>
          <select className="p-2 border border-gray-200" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value=""> (Choose) </option>
            {courseSubjects?.map((row, index) => (
              <option key={index} value={row.Subject}>
                {row.Subject}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="courseNumber"
            placeholder="(optional) Course Number"
            className="p-2 ml-2 border border-gray-200"
            value={courseNumber}
            onChange={(e) => setCourseNumber(e.target.value)}
          />
          <input
            type="text"
            name="professorLastName"
            placeholder="Professor Last Name"
            className="p-2 ml-2 border border-gray-200"
            value={professorLastName}
            onChange={(e) => setProfessorLastName(e.target.value)}
          />
          <button className="btn-primary p-2-4 ml-2 border border-gray-200" onClick={handleSearch}>
            Search
          </button>
          <input
            id="customCourse"
            style={{
              display: showCustomCourse ? 'block' : 'none',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
            size={6}
            className="p-2 border border-gray-200"
            type="text"
            name="showAll"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchCourses;
