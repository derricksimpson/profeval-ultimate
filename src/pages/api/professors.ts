import { getProfessorsBySchoolAndLetter, createProfessor } from '~/service/professor-service';

// // Create a new professor record based on LName, FName, and SchoolID
// export async function POST(context) {
//   const { request } = context;
//   const body = await request.json();
//   const { lName, fName, schoolId } = body;
//   console.log(body);
//   try {
//     const newProfessor = await createProfessor(context, lName, fName, schoolId);

//     return new Response(JSON.stringify(newProfessor), {
//       status: 201,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error('Error creating professor:', error);

//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// }

// export async function GET(context) {
//   const { request } = context;
//   const url = new URL(request.url);
//   const schoolId = Number(url.searchParams.get('SchoolID'));
//   const letter = url.searchParams.get('LNameChar');
//   try {
//     const evaluationResults = await getProfessorsBySchoolAndLetter(context, schoolId, letter);

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
