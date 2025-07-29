import { Pool } from 'pg';

const { JOKES_DB_CONNECTION_STRING } = process.env;
const pool = new Pool({ connectionString: JOKES_DB_CONNECTION_STRING });

export const query = (text: string, ...parameters: unknown[]) => pool.query(text, parameters);
