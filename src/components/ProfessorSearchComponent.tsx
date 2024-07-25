import LettersComponent from '~/components/core/LettersComponent';
import TableComponent from '~/components/core/TableComponent';
import SearchCourses, { type ProfsesorSearchResults } from '~/components/SearchCourses';
import { useEffect, useState } from 'react';
import type { Professor } from '~/models/Professor';

interface ProfessorSearchComponentProps {
  context?: any;
  schoolId: number;
  letter?: string | null;
  schoolName: string;
  initialSubjects?: any;
  initialProfessors?: Professor[];
  initialSubject?: string;
  initialCourseNumber?: string;
  initialProfessorLastName?: string;
}

const ProfessorSearchComponent = ({
  context,
  schoolId,
  letter,
  initialSubjects,
  initialProfessors,
  schoolName,
  initialSubject = '',
  initialCourseNumber = '',
  initialProfessorLastName = '',
}: ProfessorSearchComponentProps) => {
  const [professors, setProfessors] = useState(initialProfessors || []);
  const [courseSubjects, setCourseSubjects] = useState(initialSubjects || []);
  const [subject, setSubject] = useState(initialSubject);
  const [courseNumber, setCourseNumber] = useState(initialCourseNumber);
  const [professorLastName, setProfessorLastName] = useState(initialProfessorLastName);
  const [loadMore, setLoadMore] = useState(false);

  const fetchSubjects = async (schoolId) => {
    if (schoolId) {
      const subjectsResponse = await fetch(`/api/subjects?schoolId=${schoolId}`);
      const subjects = await subjectsResponse.json();
      setCourseSubjects(subjects);
    }
  };

  const handleSearch = async (searchSubject, searchCourseNumber, searchProfessorLastName) => {
    const url = new URL('/api/evals', window.location.origin);

    url.searchParams.append('Subject', searchSubject);
    url.searchParams.append('CurSchoolID', schoolId.toString());

    if (searchCourseNumber) {
      url.searchParams.append('CallNumber', searchCourseNumber);
    }

    if (searchProfessorLastName) {
      url.searchParams.append('LName', searchProfessorLastName);
    }

    try {
      const response = await fetch(url.toString());
      const data = await response.json();

      setProfessors(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const updateStateFromURL = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const newSubject = searchParams.get('Subject') || '';
    const newCourseNumber = searchParams.get('CallNumber') || '';
    const newProfessorLastName = searchParams.get('LName') || '';

    setSubject(newSubject);
    setCourseNumber(newCourseNumber);
    setProfessorLastName(newProfessorLastName);

    handleSearch(newSubject, newCourseNumber, newProfessorLastName);
  };

  useEffect(() => {
    fetchSubjects(schoolId);
  }, [schoolId]);

  useEffect(() => {
    const handlePopState = () => {
      updateStateFromURL();
    };

    window.addEventListener('popstate', handlePopState);

    // Initial search on component mount
    updateStateFromURL();

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [schoolId]);

  useEffect(() => {
    if (letter) {
      fetch(`/api/professors-by-letter?schoolId=${schoolId}&letter=${letter}`)
        .then((response) => response.json())
        .then((data) => {
          setProfessors(data);
        });
    }
  }, [letter]);

  const onProfessorResults = (results: ProfsesorSearchResults) => {
    setProfessors(results.professors);
    setLoadMore(results.hasMore);
  };

  return (
    <div className="container">
      <h1 className="text-2xl md:text-3xl font-bold">{schoolName}</h1>

      <div className="ml-12">
        <SearchCourses
          context={context}
          schoolId={schoolId}
          courseSubjects={courseSubjects}
          onSearchResults={onProfessorResults}
          initialSubject={subject}
          initialCourseNumber={courseNumber}
          initialProfessorLastName={professorLastName}
        />
      </div>

      <div>
        <h2 className="ml-12 mt-3 font-bold">Find your professor by last name</h2>
        <div className="mt-4">
          <LettersComponent schoolId={String(schoolId)} schoolName={schoolName} activeLetter={letter} />
        </div>
      </div>

      <TableComponent schoolId={schoolId} schoolURL={schoolName} professors={professors} />
      {loadMore && (<button className="btn-primary" onClick={() => setLoadMore(false)}>Load More</button>)}


    </div>
  );
};

export default ProfessorSearchComponent;
