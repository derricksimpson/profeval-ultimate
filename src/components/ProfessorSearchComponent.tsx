import LettersComponent from '~/components/core/LettersComponent';
import TableComponent from '~/components/core/TableComponent';
import SearchCourses from '~/components/SearchCourses';
import { useEffect, useState } from 'react';
import type { Professor } from '~/models/Professor';

interface ProfessorSearchComponentProps {
  context?: any;
  schoolId: number;
  letter?: string | null;
  schoolName: string;
  initialSubjects?: any;
  initialProfessors?: Professor[];
}

const ProfessorSearchComponent = ({
  context,
  schoolId,
  letter,
  initialSubjects,
  initialProfessors,
  schoolName,
}: ProfessorSearchComponentProps) => {
  const [professors, setProfessors] = useState(initialProfessors);
  const [courseSubjects, setCourseSubjects] = useState(initialSubjects);

  const fetchSubjects = async (schoolId) => {
    if (schoolId) {
      const subjectsResponse = await fetch(`/api/subjects?schoolId=${schoolId}`);
      const subjects = await subjectsResponse.json();
      setCourseSubjects(subjects);
    }
  };

  useEffect(() => {
    fetchSubjects(schoolId);
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

  const onProfessorResults = (professors) => {
    setProfessors(professors);
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
        />
      </div>

      <div>
        <h2 className="ml-12 mt-3 font-bold">Find your professor by last name</h2>
        <div className="mt-4">
          <LettersComponent schoolId={String(schoolId)} schoolName={schoolName} activeLetter={letter} />
        </div>
      </div>

      {<TableComponent schoolId={schoolId} schoolURL={schoolName} professors={professors} />}
    </div>
  );
};

export default ProfessorSearchComponent;
