export function toResponse(body, code = 200) {
  return new Response(JSON.stringify(body), {
    status: code,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function xorEncode(data: string, key: string): string {
  let encoded = '';
  for (let i = 0; i < data.length; i++) {
    encoded += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return encoded;
}

export default async function handler(func) {
  try {
    const content = await func();

    return new Response(JSON.stringify(content), {
      status: 200,
      headers: {
        'Content-Type': 'application/*+avro', //'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
