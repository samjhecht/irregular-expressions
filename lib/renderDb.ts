
import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  connectionString: process.env.RENDER_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // connectionTimeoutMillis: 10000, // idle timeout of 10 seconds
});

export async function connectToDatabase(): Promise<PoolClient> {
  const client = await pool.connect();
  return client;
}