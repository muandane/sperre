import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "../config/config";

const client = postgres(config.connectionString);
export const db = drizzle(client, { logger: true });
