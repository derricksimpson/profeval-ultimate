import { getSearchResults } from '~/service/evaluation-service';

export async function GET(context) {
  const { request } = context;
  const url = new URL(request.url);
  const searchString = url.searchParams.get('q');

  if (!searchString) {
    return new Response(JSON.stringify({ schoolResults: [], professorResults: [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const [schoolResults, professorResults] = await getSearchResults(context, searchString);
    return new Response(JSON.stringify({ schoolResults, professorResults }), {
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
