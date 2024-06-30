import type { APIContext } from 'astro';

export async function POST(context: APIContext) {
  let d = new Date();
  return new Response('Hello World: ' + d.toISOString());
}

/*
import { v4 as uuidv4 } from 'uuid';

const DB = {} as any;

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST' && new URL(request.url).pathname === '/api/quiz') {
    const data = await request.json();
    const quizUuid = uuidv4(); // Generate UUID on the server

    // Insert quiz into D1 database
    await DB.prepare('INSERT INTO quizzes (uuid, title, email_address) VALUES (?, ?, ?)')
      .bind(quizUuid, data.title, data.email_address)
      .run();

    // Insert questions
    for (const question of data.questions) {
      const questionId = uuidv4(); // Generate UUID for each question
      await DB.prepare('INSERT INTO questions (id, quiz_uuid, text) VALUES (?, ?, ?)')
        .bind(questionId, quizUuid, question.text)
        .run();

      // Insert answers
      for (const answer of question.answers) {
        await DB.prepare('INSERT INTO answers (question_id, text) VALUES (?, ?)').bind(questionId, answer).run();
      }
    }

    return new Response(JSON.stringify({ success: true, uuid: quizUuid }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Not Found', { status: 404 });
}
*/
