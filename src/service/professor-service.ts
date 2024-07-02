import type { Evaluation } from '~/models/Evaluation';

export const getProfessorsBySchoolAndLetter = async (Astro, id: number, letter: string) => {
  const DB = Astro.locals.runtime.env.DB;

  let response = await DB.prepare(
    `SELECT DISTINCT p.id as professorId, p.LName, p.FName, GROUP_CONCAT(DISTINCT e.Subject) AS Subjects, COUNT(e.id) AS EvaluationCount
      FROM professors p
      JOIN evaluations e ON p.id = e.professorId
      WHERE e.SchoolId = ? AND UPPER(SUBSTR(p.LName, 1, 1)) = UPPER(?)
      GROUP BY p.id, p.LName, p.FName
      ORDER BY p.LName, p.FName
      `
  )
    .bind(id, letter)
    .all();

  let evaluations = response.results as Array<Evaluation>;

  return evaluations;
};

export const getEvaluationsForProfessor = async (Astro, professorId: number, limit: number = 10) => {
  const DB = Astro.locals.runtime.env.DB;

  let response = await DB.prepare(
    `SELECT *
      FROM evaluations e
      WHERE e.professorId = ?
      ORDER BY e.PostDate DESC
      LIMIT ${limit}
      `
  )
    .bind(professorId)
    .all();

  let evaluations = response.results as Array<Evaluation>;

  return evaluations;
};
