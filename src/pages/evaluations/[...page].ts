import { stateById } from '~/data/states';
import type { APIContext } from 'astro';
import { getEvaluationDetailsById } from '~/service/evaluation-service';

// NOTE: we may choose to use /evaluations/ directly instad of redirects
/* 

NOT WORKING-

- By Last name
http://localhost:4321/evaluations/list.asp?CurSchoolID=908&Subject=&CallNumber=&LName=Benson&Sort=1

 - By Department
http://localhost:4321/evaluations/list.asp?Subject=CS&CallNumber=&LName=


 With Page number
http://localhost:4321/evaluations/list.asp?CurSchoolID=908&Subject=&CallNumber=&LName=Li&Sort=3&Page=5

-- Specific IDs



Working
http://localhost:4321/evaluations/view.asp?CurSchoolID=908&Subject=ART&CallNumber=240&LName=&Sort=6&ID=13525
http://localhost:4321/evaluations/view.asp?CurSchoolID=908&Subject=CS&CallNumber=&LName=&Sort=5&ID=3637

http://localhost:4321/evaluations/view.asp?CurSchoolID=908&Subject=CS&CallNumber=&LName=&Sort=3&ID=5360
http://localhost:4321/evaluations/view.asp?Subject=&CallNumber=&LName=Browder&Sort=0&ID=18197

http://localhost:4321/evaluations/view.asp?CurSchoolID=908&Subjevaluations/view.asp?CurSchoolID=908&Subject=&CallNumber=&LName=&Sort=4&ID=14169
-> to  http://localhost:4321/professors/Western%20Kentucky%20University/908/Hardin-Joe%20M./2142?evaluationId=14169

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

      return permRedirect(`/school/school_name/${schoolId}?LName=${lname}`);
    }
  }

  if (page === 'view.asp') {
    console.log('redirect to view.asp');
    let id = url.searchParams.get('ID');
    let details = await getEvaluationDetailsById(context, Number(id));

    // http://localhost:4321/professors/Western%20Kentucky%20University/908/Hardin-Joe%20M./2142?evaluationId=14169

    return permRedirect(
      `/professors/${details.urlFriendlySchoolName()}/${details.schoolId}/${details.urlFriendlyProfName()}/${details.professorId}?evaluationId=${id}`
    );
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: '/404/?page=' + page + '&status=307',
    },
  });
}
