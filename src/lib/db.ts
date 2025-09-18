
import { Pool } from 'pg';

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
} else {
  // Use a global object to preserve the pool across hot reloads in development
  if (!global._pgPool) {
    global._pgPool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }
  pool = global._pgPool;
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}
