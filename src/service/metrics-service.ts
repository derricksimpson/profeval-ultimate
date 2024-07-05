export async function measure(db, { query, response }, functionName = null) {
  console.log(functionName || '', 'measuring query: rows_read', response.meta.rows_read);
  return Promise.resolve(true);
  // return await db
  //   .prepare('insert into query_metrics (query, rows, inserted_at) values (?, ?, ?)')
  //   .bind(query, response.meta.rows_read, new Date().toDateString())
  //   .all();
}
