import handler from './base';
import { getSchoolsByState } from '~/service/school-service';

export async function GET(context) {
  return handler(async () => {
    const { request } = context;

    const url = new URL(request.url);
    const stateId = url.searchParams.get('stateId');

    return await getSchoolsByState(context, stateId);
  });
}
