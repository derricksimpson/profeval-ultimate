import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  let d = new Date();
  return new Response('Hello World: ' + d.toISOString());
}
