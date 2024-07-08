import { getEvaluationSearchResults, getSearchResults } from '~/service/evaluation-service';

//
// CurSchoolID=908&Subject=&CallNumber=&LName=S&Sort=6

export async function GET(context) {
  const { request } = context;
  const url = new URL(request.url);
  const subject = url.searchParams.get('Subject');
  const schoolId = url.searchParams.get('CurSchoolID');
  const callNumber = url.searchParams.get('CallNumber');
  const lastName = url.searchParams.get('LName');

  try {
    const evaluationResults = await getEvaluationSearchResults(context, { schoolId, subject, callNumber, lastName });
    return new Response(JSON.stringify(evaluationResults), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching search results:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
