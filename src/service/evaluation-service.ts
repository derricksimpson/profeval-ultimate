import type { Evaluation, EvaluationData } from '~/models/Evaluation';

export const getEvaluationsBySchool = async (id: number) => {};

export const getEvaluationsBySchoolLetter = async (Astro, id: number, letter: string) => {
  const DB = Astro.locals.runtime.env.DB;

  let response = await DB.prepare('SELECT * FROM Schools where RegionId = ? order by name').bind(id).all();
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

  console.log('Query:', query);

  console.log('Params', parameters);

  const response = await db
    .prepare(query)
    .bind(...parameters)
    .all();

  //await measure(db, { query, response });

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

  const query = `SELECT id, lname, fname FROM professors WHERE ${whereClause} order by lname, fname;`;

  const params = keywords.flatMap((keyword) => Array(columns.length).fill(`${keyword}%`));

  const response = await db
    .prepare(query)
    .bind(...params)
    .all();

  //await measure(db, { query, response });

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

export const getAllSubjects = async (Astro, schoolId: number) => {
  const DB = Astro.locals.runtime.env.DB;

  const KV = Astro.locals.runtime.env.profeval;

  let value = await KV.get(`subjects_${schoolId}`);
  if (value) {
    console.log('FOUND in kv!');
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
