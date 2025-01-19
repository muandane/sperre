import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "../config/config";
import * as schema from "@/db/schema/index";

const client = postgres(config.connectionString);
export const db = drizzle(client, { schema });
