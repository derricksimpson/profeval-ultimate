import { School } from '~/models/School';
import { measureQuery } from './metrics-service';

export const getSchoolById = async (context, id: number): Promise<School> => {
  if (id > 0) {
    const DB = context.locals.runtime.env.DB;
    const db = DB;
    let query = `SELECT * from schools where id = ?`;

    let response = await DB.prepare(query).bind(id).all();

    await measureQuery(db, { query, response }, 'getSchoolById');

    let school = response?.results[0] as School;

    return School.fromRaw(school);
  }
  return Promise.resolve(null);
};

/**
 *
 * @param context
 * @param state
 * @returns
 */
export const getSchoolsByState = async (context, state: string): Promise<School[]> => {
  if (state) {
    const DB = context.locals.runtime.env.DB;
    const db = DB;
    let query = `SELECT * from schools where RegionId = ? order by Name Asc`;

    let response = await DB.prepare(query).bind(state).all();

    await measureQuery(db, { query, response }, 'getSchoolsByState');

    let schools = response?.results as School[];

    return schools.map((school) => School.fromRaw(school));
  }
  return Promise.resolve([]);
};
