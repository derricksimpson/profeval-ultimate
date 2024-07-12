import type { Evaluation, EvaluationData } from '~/models/Evaluation';
import { measureQuery } from './metrics-service';

export const getEvaluationsBySchool = async (id: number) => {};

export const getEvaluationsBySchoolLetter = async (Astro, id: number, letter: string) => {
  const DB = Astro.locals.runtime.env.DB;

  let response = await DB.prepare('SELECT * FROM professors where schoolId = ? and LName order by name').bind(id).all();
  let evaluations = response.results as Array<Evaluation>;
};

// Function to search the school table
async function searchSchools(db, searchText: string[]) {
  const keywords = searchText.map((keyword) => `%${keyword}%`);
  const conditions: string[] = [];
  const parameters: string[] = [];

  keywords.forEach((keyword) => {
    conditions.push(`
          (CASE 
              WHEN name = ? THEN 5
              WHEN name LIKE ? THEN 1
              ELSE 0
          END) +
          (CASE 
              WHEN abbr = ? THEN 10
              WHEN abbr LIKE ? THEN 1
              ELSE 0
          END)
      `);

    parameters.push(keyword.trim(), keyword, keyword.trim(), keyword);
  });

  const query = `
      SELECT id, name, abbr,
          ${conditions.join(' + ')} AS score
      FROM schools
      group by id
      HAVING score > 0
      ORDER BY score DESC;
  `;

  // console.log('Query:', query);
  // console.log('Params', parameters);

  const response = await db
    .prepare(query)
    .bind(...parameters)
    .all();

  await measureQuery(db, { query, response });

  return response.results;
}

function generateWhereClause(columns, keywords) {
  const conditions = [];
  for (const column of columns) {
    for (const keyword of keywords) {
      conditions.push(`${column} LIKE ?`);
    }
  }
  return conditions.join(' OR ');
}

async function searchProfessors(db, keywords) {
  const columns = ['lname', 'fname'];

  const whereClause = generateWhereClause(columns, keywords);

  const query = `SELECT id, schoolId, lname, fname FROM professors WHERE ${whereClause} order by lname, fname;`;

  const params = keywords.flatMap((keyword) => Array(columns.length).fill(`${keyword}%`));

  const response = await db
    .prepare(query)
    .bind(...params)
    .all();

  await measureQuery(db, { query, response });

  return response?.results.map((result) => ({ ...result, result_type: 'professor' }));
}

export const getSearchResults = async (Astro, query: string) => {
  try {
    const DB = Astro.locals.runtime.env.DB;
    const keywords = query.split(' ');

    console.log('search with keywords: ', keywords);

    return await Promise.all([searchSchools(DB, keywords), searchProfessors(DB, keywords)]);
  } catch (e) {
    console.error('failed on query', e);
  }
};

export const getEmptyEvaluations = async (Astro) => {
  try {
    let sql = 'SELECT * FROM Evaluations where professorId is null';
    const DB = Astro.locals.runtime.env.DB;
    let response = await DB.prepare(sql)

      .all();

    return response.results;
  } catch (e) {
    console.error('failed on query', e);
  }
};

export const setProfessorIdOnEvalution = async (Astro, professorId, evaluationId) => {
  try {
    const DB = Astro.locals.runtime.env.DB;
    let response = await DB.prepare('UPDATE Evaluations set professorId = ? where ID = ?')
      .bind(professorId, evaluationId)
      .run();
    console.log('Mapped eval to Prof', response);
    return response.results;
  } catch (e) {
    console.error('failed on query', e);
  }
};

export const getEvaluationSearchResults = async (Astro, params) => {
  let { schoolId, subject, callNumber, lastName } = params;

  try {
    if (!schoolId) {
      return [];
    }
    const DB = Astro.locals.runtime.env.DB;

    let params = [];

    let sql = `SELECT 
     distinct p.lName, p.fName, p.overall, p.subjects, p.id as professorId, p.evaluationCount
      FROM Evaluations e, Professors p
      where e.professorId = p.ID
      and p.schoolId = ? `;

    params.push(schoolId);

    if (subject) {
      sql += 'and e.Subject = ? ';
      params.push(subject);
    }

    if (callNumber) {
      sql += 'and e.CallNumber = ? ';
      params.push(callNumber);
    }

    if (lastName) {
      sql += 'and p.LName like ? ';
      params.push(lastName + '%');
    }

    sql += 'order by p.lName, p.fName limit 25';

    console.log('Query', sql);

    let response = await DB.prepare(sql)
      .bind(...params)
      .all();

    return response.results;
  } catch (e) {
    console.error('failed on query', e);
  }
};

export const getAllSubjects = async (Astro, schoolId: number) => {
  const DB = Astro.locals.runtime.env.DB;

  const KV = Astro.locals.runtime.env.profeval;

  let value = await KV.get(`subjects_${schoolId}`);

  if (value) {
    return value.split(',').map((subject) => ({ Subject: subject }));
  }

  //let query = 'SELECT distinct Subject from Evaluations where schoolId = ? order by Subject asc';
  let query = 'select * from aggregated_subjects where SchoolID = ?';
  const response = await DB.prepare(query).bind(schoolId).all();

  if (response.results.length > 0) {
    let subjects = response.results[0].Subjects.split(',');
    await KV.put(`subjects_${schoolId}`, response.results[0].Subjects);
    return subjects.map((subject) => ({ Subject: subject }));
  }
};

export const saveEvaluation = async (Astro, professor, evaluation: EvaluationData) => {
  // don't forget to increment the evaluation count!  (or, simply use the below)
  // Re-aggregate subjects for this profssorLetter and character
};

// Aggregations for professor table
/*

-- new evaluation count
WITH eval_counts AS (
    SELECT 
        professorId, 
        count(professorId) as evalCount
    FROM evaluations 
    GROUP BY professorId
)
UPDATE professors
SET evaluationCount = (
    SELECT evalCount
    FROM eval_counts
    WHERE eval_counts.professorId = professors.id
)
WHERE professors.id IN (
    SELECT professorId
    FROM eval_counts
);





Aggregate and set overall rating
WITH evals AS (
    SELECT 
        professorId, 
        CAST(json_extract(EvaluationData, '$.o') AS INTEGER) AS overall 
    FROM evaluations 
    WHERE CAST(json_extract(EvaluationData, '$.o') AS INTEGER) > 0
),
avg_overall AS (
    SELECT 
        professorId, 
        round((sum(overall) * 1.0 / count(overall)),2) as avg_overall
    FROM evals 
    GROUP BY professorId
)
UPDATE professors
SET overall = (
    SELECT avg_overall
    FROM avg_overall
    WHERE avg_overall.professorId = professors.id
)
WHERE professors.id IN (
    SELECT professorId
    FROM avg_overall
);


*/
