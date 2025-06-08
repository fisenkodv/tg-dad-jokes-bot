import { Pool } from 'pg';

const pool = new Pool();

export const query = (text: string, ...parameters: unknown[]) => pool.query(text, parameters);
