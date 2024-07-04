import type { Evaluation, EvaluationData } from '~/models/Evaluation';

export const getEvaluationsBySchool = async (id: number) => {};

export const getEvaluationsBySchoolLetter = async (Astro, id: number, letter: string) => {
  const DB = Astro.locals.runtime.env.DB;

  let response = await DB.prepare('SELECT * FROM Schools where RegionId = ? order by name').bind(id).all();
  let evaluations = response.results as Array<Evaluation>;
};

async function searchSchools2(db, keywords) {
  function generateWhereClauseAndCount(columns, keywords) {
    const conditions = [];
    const caseParams = [];
    const conditionParams = [];
    const counts = [];

    for (const keyword of keywords) {
      const likePattern = `%${keyword}%`;
      for (const column of columns) {
        // Add conditions for LIKE
        conditions.push(`(${column} LIKE ?)`);
        conditionParams.push(likePattern);

        // Determine score multiplier
        let score = column === 'abbr' ? 10 : 1;

        // Add exact match condition and score for abbr column
        counts.push(`(CASE WHEN ${column} = ? THEN ${score * 5} ELSE 0 END)`);
        caseParams.push(keyword); // For exact match

        // Add conditions for CASE statements with LIKE
        counts.push(`(CASE WHEN ${column} LIKE ? THEN ${score} ELSE 0 END)`);
        caseParams.push(likePattern);
      }
    }

    return {
      whereClause: conditions.join(' OR '),
      countClause: counts.join(' + '),
      params: [...conditionParams, ...caseParams], // Combine both lists
    };
  }

  const columns = ['name', 'abbr'];
  const { whereClause, countClause, params } = generateWhereClauseAndCount(columns, keywords);

  const query = `
      SELECT 
          id AS ID, 
          name AS Name, 
          abbr, 
          (${countClause}) AS keyword_matches 
      FROM 
          schools 
      WHERE 
          ${whereClause}
      ORDER BY 
          keyword_matches DESC;
  `;

  console.log('query:', query);
  console.log('params:', params);

  const response = await db
    .prepare(query)
    .bind(...params)
    .all();

  console.log('response:', response);

  return response?.results.map((result) => ({ ...result, result_type: 'school' }));
}

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

  const results = await db
    .prepare(query)
    .bind(...parameters)
    .all();
  return results.results;
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
  const response = await DB.prepare('SELECT distinct Subject from Evaluations where schoolId = ? order by Subject asc')
    .bind(schoolId)
    .all();

  return response.results;
};
