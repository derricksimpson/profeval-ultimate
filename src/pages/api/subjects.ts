import { getAllSubjects } from '~/service/evaluation-service';
import handler from './base';

export async function GET(context) {
  return handler(async () => {
    const { request } = context;

    const url = new URL(request.url);
    const schoolId = Number(url.searchParams.get('schoolId'));

    return await getAllSubjects(context, schoolId);
  });
}
