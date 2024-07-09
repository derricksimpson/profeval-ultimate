import React, { useState } from 'react';

interface Subject {
  Subject: string;
}

interface SearchCoursesProps {
  schoolId: number;
  courseSubjects: Subject[];
  onSearch: (subject: string, courseNumber: string) => void;
}

const SearchCourses: React.FC<SearchCoursesProps> = ({ schoolId, courseSubjects, onSearch }) => {
  const [subject, setSubject] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [showCustomCourse, setShowCustomCourse] = useState(false);

  const handleSearch = () => {
    onSearch(subject, courseNumber);
  };

  if (courseSubjects?.length > 0) {
    return (
      <div className="mt-4">
        <h2 className="mt-6">Search By Department</h2>
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
              className="p-2  ml-2 border border-gray-200"
              value={courseNumber}
              onChange={(e) => setCourseNumber(e.target.value)}
            />
            <button className="btn-primary p-2 ml-2 border border-gray-200" onClick={handleSearch}>
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
  } else {
    return null;
  }
};

export default SearchCourses;
