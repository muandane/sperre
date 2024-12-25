import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { config } from '../config/config';

const client = postgres(config.connectionString);
export const db = drizzle(client, { schema });