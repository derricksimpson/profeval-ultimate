export async function measureQuery(db, { query, response }, functionName = null) {
  try {
    return await db
      .prepare('insert into query_metrics (query, rows, inserted_at) values (?, ?, ?)')
      .bind(query, response.meta.rows_read, new Date().toDateString())
      .all();
  } catch (e) {
    return Promise.resolve(false);
  }
}
