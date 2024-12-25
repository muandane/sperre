import { defineConfig } from "drizzle-kit";
import { config } from "./src/config/config";

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: config.connectionString,
  }
})