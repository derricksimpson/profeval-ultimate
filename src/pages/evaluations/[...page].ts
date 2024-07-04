import { stateById } from '~/data/states';
import type { APIContext } from 'astro';

// NOTE: we may choose to use /evaluations/ directly instad of redirects
/* 

NOT WORKING-

- By Last name
http://localhost:4321/evaluations/list.asp?CurSchoolID=908&Subject=&CallNumber=&LName=Benson&Sort=1

 - By Department
http://localhost:4321/evaluations/list.asp?Subject=CS&CallNumber=&LName=


Working
http://localhost:4321/evaluations/view.asp?CurSchoolID=908&Subject=CS&CallNumber=&LName=&Sort=3&ID=5360
*/

export const permRedirect = (url: string) => {
  console.log('permRedirect', url);

  return new Response(null, {
    status: 307, // TODO: use 301 here when in production
    headers: {
      Location: url,
    },
  });
};

export async function GET(context: APIContext) {
  const { params } = context;
  let url = new URL(context.url);

  let page = params?.page?.toLowerCase();

  console.log({ params });
  console.log('Full URL', context.url);
  console.log('URL Params', url.searchParams);
  console.log('PAGE', page);

  if (page === 'list.asp') {
    // if only the LName parameter is here
    if (url.searchParams.get('LName') && url.searchParams.get('CurSchoolID')) {
      let lname = url.searchParams.get('LName');
      let schoolId = url.searchParams.get('CurSchoolID');

      return permRedirect(`/school/school_name/${schoolId}?lastname=${lname}`);
    }
  }

  if (page === 'view.asp') {
    console.log('redirect to view.asp');
    let id = url.searchParams.get('ID');
    return permRedirect(`/evaluation/${id}`);
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: '/404/?page=' + page + '&status=307',
    },
  });
}
