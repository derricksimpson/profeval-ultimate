import { stateById } from '~/data/states';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const { params } = context;
  let url = new URL(context.url);

  let page = params?.page?.toLowerCase();

  if (page === 'chooseschool.asp') {
    let stateId = url.searchParams.get('RegionID');
    let state = stateById(stateId);

    return new Response(null, {
      status: 301,
      headers: {
        Location: '/state/' + state.name + '/' + stateId,
      },
    });
  } else if (!page) {
    //check search params for CurSchoolID
    let schoolId = url.searchParams.get('CurSchoolID');
    if (schoolId) {
      return new Response(null, {
        status: 301,
        headers: {
          Location: '/school/name/' + schoolId,
        },
      });
    }

    return new Response(null, {
      status: 307,
      headers: {
        Location: '/404/?page=' + page + '&status=307',
      },
    });
  } else {
    return new Response(null, {
      status: 307,
      headers: {
        Location: '/404/?page=' + page + '&status=307',
      },
    });
  }
}
