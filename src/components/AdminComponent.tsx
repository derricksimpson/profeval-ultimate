import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '~/common/api';

interface Eval {
  ID: string;
  SchoolID: string;
  LName: string;
  FName: string;
}

interface Professor {
  professorId: string;
  schoolId: string;
  lName: string;
  fName: string;
}

const AdminComponent: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Eval[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedEval, setSelectedEval] = useState<Eval | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [newProfessor, setNewProfessor] = useState({ lname: '', fname: '' });

  // Inside your component
  const newCharRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const data = await apiFetch.get('/api/empty-evals');
      setEvaluations(data);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    }
  };

  const fetchProfessors = async (schoolId: string, lNameChar: string) => {
    try {
      const data = await apiFetch.get(`/api/professors?SchoolID=${schoolId}&LNameChar=${lNameChar}`);
      setProfessors(data);
    } catch (error) {
      console.error('Error fetching professors:', error);
    }
  };

  const findByFirstName = async () => {
    if (selectedEval) {
      let lNameChar = newCharRef?.current?.value || selectedEval.FName.substring(0, 1);

      await fetchProfessors(selectedEval.SchoolID, lNameChar);
    }
  };

  const handleEvalClick = (evaluation: Eval) => {
    setSelectedEval(evaluation);
    setNewProfessor({ lname: evaluation.LName, fname: evaluation.FName });
    let lNameChar = evaluation.LName.substring(0, 1);
    fetchProfessors(evaluation.SchoolID, lNameChar);
  };

  const handleProfessorClick = (professor: Professor) => {
    setSelectedProfessor(professor);
  };

  const handleAssign = async () => {
    if (selectedEval && selectedProfessor) {
      await apiFetch.get(
        `/api/eval-to-professor?evaluationId=${selectedEval.ID}&professorId=${selectedProfessor.professorId}`
      );
      fetchEvaluations();
      // Handle the assign logic here
      console.log(`Assigned Professor ${selectedProfessor.professorId} to Evaluation ${selectedEval.ID}`);
    }
  };

  const handleCreateNewProfessor = async () => {
    try {
      await apiFetch.post('/api/professors', {
        lName: newProfessor.lname,
        fName: newProfessor.fname,
        schoolId: selectedEval.SchoolID, // Assuming the schoolId is the same as the selected evaluation
      });

      // Refresh the professor list after creating a new one
      if (selectedEval) {
        setTimeout(() => {
          fetchProfessors(selectedEval.SchoolID, newProfessor.lname.substring(0, 1));
        }, 500);
      }
      setNewProfessor({ lname: '', fname: '' });
    } catch (error) {
      console.error('Error creating new professor:', error);
    }
  };

  const renderEvaluations = () => (
    <div style={{ height: '400px', overflowY: 'scroll' }}>
      {evaluations.map((evaluation) => (
        <div
          key={evaluation.ID}
          onClick={() => handleEvalClick(evaluation)}
          style={{ cursor: 'pointer', background: selectedEval === evaluation ? 'lightgray' : 'white' }}
        >
          S-{evaluation.SchoolID} - {evaluation.LName}, {evaluation.FName}
        </div>
      ))}
    </div>
  );

  const renderProfessors = () => (
    <div style={{ height: '400px', overflowY: 'scroll' }}>
      {professors.map((professor) => (
        <div
          key={professor.professorId}
          onClick={() => handleProfessorClick(professor)}
          style={{ background: selectedProfessor === professor ? 'lightgray' : 'white' }}
        >
          {professor.lName}, {professor.fName}
        </div>
      ))}
    </div>
  );

  const renderCreateProfessorForm = () => (
    <div>
      <h2>Create a new professor here</h2>
      <input
        type="text"
        placeholder="First Name"
        className="m-2 border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={newProfessor.fname}
        onChange={(e) => setNewProfessor({ ...newProfessor, fname: e.target.value })}
      />{' '}
      <br />
      <input
        type="text"
        placeholder="Last Name"
        className="m-2 border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={newProfessor.lname}
        onChange={(e) => setNewProfessor({ ...newProfessor, lname: e.target.value })}
      />
      <br />
      <button className="m-2 btn-secondary" onClick={handleCreateNewProfessor}>
        Create New
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ border: '1px solid #ddd', width: '40%', float: 'left', margin: '1em' }}>
        <h2 className="p-2">Evaluations</h2>
        {renderEvaluations()}
      </div>
      <div style={{ border: '1px solid #ddd', width: '40%', float: 'left', margin: '1em' }}>
        <h2 className="p-2">Professors</h2>
        {selectedEval && renderProfessors()}
      </div>

      <div style={{ border: '1px ', width: '40%', float: 'left', margin: '1em' }}>
        <button className="btn-primary" onClick={() => findByFirstName()}>
          By Character -
        </button>
        <input type="text" name="newChar" ref={newCharRef} placeholder="character" />
      </div>
      <div style={{ border: '1px', width: '40%', float: 'left', margin: '1em' }}>
        <button className="btn-primary" onClick={handleAssign} disabled={!selectedEval || !selectedProfessor}>
          Assign
        </button>
      </div>
      <div style={{ clear: 'left' }}>{renderCreateProfessorForm()}</div>
    </div>
  );
};

export default AdminComponent;
