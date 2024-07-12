import { setProfessorIdOnEvalution } from '~/service/evaluation-service';

// export async function GET(context) {
//   const { request } = context;
//   const url = new URL(request.url);

//   const evaluationId = url.searchParams.get('evaluationId');
//   const professorId = url.searchParams.get('professorId');

//   try {
//     const evaluationResults = await setProfessorIdOnEvalution(context, professorId, evaluationId);

//     return new Response(JSON.stringify(evaluationResults), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching search results:', error);

//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// }
