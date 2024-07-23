import handler from './base';
import { getProfessorsBySchoolAndLetter, searchProfessorsBySchool } from '~/service/professor-service';

export async function GET(context) {
  return handler(async () => {
    const { request } = context;

    const url = new URL(request.url);
    const schoolId = Number(url.searchParams.get('schoolId'));
    const letter = url.searchParams.get('letter');

    if (letter.length > 1) {
      return await searchProfessorsBySchool(context, schoolId, letter);
    }

    return await getProfessorsBySchoolAndLetter(context, schoolId, letter);
  });
}
