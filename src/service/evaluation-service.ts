import type { Evaluation, EvaluationData } from '~/models/Evaluation';

export const getEvaluationsBySchool = async (id: number) => {};

export const getEvaluationsBySchoolLetter = async (Astro, id: number, letter: string) => {
  const DB = Astro.locals.runtime.env.DB;

  let response = await DB.prepare('SELECT * FROM Schools where RegionId = ? order by name').bind(id).all();
  let evaluations = response.results as Array<Evaluation>;
};
