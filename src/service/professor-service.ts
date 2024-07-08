import type { Evaluation } from '~/models/Evaluation';
import { measureQuery } from './metrics-service';

export const getProfessorsBySchoolAndLetter = async (Astro, id: number, letter: string) => {
  const DB = Astro.locals.runtime.env.DB;
  const db = DB;
  console.log({ id, letter });
  let query = `SELECT id as professorId, LName as lName, FName as fName, subjects , evaluationCount
    FROM professors p
    WHERE p.SchoolId = ? AND LNameChar = UPPER(?)
    ORDER BY p.LName, p.FName
  `;

  console.log('Query:', query);
  //let query = `select * from aggregated_school_professors where SchoolId = ? and LNameChar = ?;`;

  let response = await DB.prepare(query).bind(id, letter).all();

  await measureQuery(db, { query, response }, 'getProfessorsBySchoolAndLetter');

  let evaluations = response?.results as Array<Evaluation>;

  return evaluations;
};

export const getEvaluationsForProfessor = async (Astro, professorId: number, limit: number = 10) => {
  const DB = Astro.locals.runtime.env.DB;

  let query = `SELECT *
    FROM evaluations e
    WHERE e.professorId = ?
    ORDER BY e.PostDate DESC
    LIMIT ${limit}
  `;

  let response = await DB.prepare(query).bind(professorId).all();
  await measureQuery(DB, { query, response }, 'getProfessorsBySchoolAndLetter');

  let evaluations = response.results as Array<Evaluation>;

  return evaluations;
};

export const createAggregation = async (Astro, schoolId, lNameChar: string) => {
  let sql = `SELECT
      a.SchoolID,
      a.LNameChar,
      '[' || GROUP_CONCAT('{"ProfessorId":' || a.ProfessorId || ',"LName":"' || a.LName || '","FName":"' || a.FName || '","Subjects":"' || a.Subjects || '","EvaluationCount":' || a.EvaluationCount || '}') || ']' AS AggregatedProfessors
    FROM (
      SELECT  
        e.SchoolId,
        LNameChar, 
        p.id as ProfessorId, 
        p.LName, 
        p.FName, 
        GROUP_CONCAT(DISTINCT e.Subject) AS Subjects, 
        COUNT(e.id) AS EvaluationCount
      FROM professors p
      JOIN evaluations e ON p.id = e.professorId
      WHERE e.SchoolId = ? AND LNameChar = UPPER(?)
      GROUP BY LNameChar, p.id, p.LName, p.FName, e.SchoolId
      ORDER BY p.LName, p.FName
    ) a
    GROUP BY a.SchoolID, a.LNameChar;`;

  // update table

  // bind params!
};

export const createProfessor = async (Astro, lName: string, fName: string, schoolId: number) => {
  const DB = Astro.locals.runtime.env.DB;

  let query = `INSERT INTO professors (LName, FName, LNameChar, SchoolId) VALUES (?, ?, ?, ?)`;

  let response = await DB.prepare(query).bind(lName, fName, lName.substring(0, 1).toUpperCase(), schoolId).run();

  await measureQuery(DB, { query, response }, 'createProfessor');

  return response.lastInsertRowid;
};
