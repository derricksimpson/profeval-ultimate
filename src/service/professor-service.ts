import type { Evaluation } from '~/models/Evaluation';
import { measure } from './metrics-service';

export const getProfessorsBySchoolAndLetter = async (Astro, id: number, letter: string) => {
  const DB = Astro.locals.runtime.env.DB;
  const db = DB;

  let query = `SELECT DISTINCT p.id as professorId, p.LName, p.FName, GROUP_CONCAT(DISTINCT e.Subject) AS Subjects, COUNT(e.id) AS EvaluationCount
  FROM professors p
  JOIN evaluations e ON p.id = e.professorId
  WHERE e.SchoolId = ? AND LNameChar = UPPER(?)
  GROUP BY p.id, p.LName, p.FName
  ORDER BY p.LName, p.FName
  `;

  let response = await DB.prepare(query).bind(id, letter).all();

  await measure(db, { query, response }, 'getProfessorsBySchoolAndLetter');

  let evaluations = response.results as Array<Evaluation>;

  return evaluations;
};

export const getEvaluationsForProfessor = async (Astro, professorId: number, limit: number = 10) => {
  const DB = Astro.locals.runtime.env.DB;
  const db = DB;
  let query = `SELECT *
    FROM evaluations e
    WHERE e.professorId = ?
    ORDER BY e.PostDate DESC
    LIMIT ${limit}
  `;

  let response = await DB.prepare(query).bind(professorId).all();

  let evaluations = response.results as Array<Evaluation>;
  console.log(response.meta);
  return evaluations;
};
