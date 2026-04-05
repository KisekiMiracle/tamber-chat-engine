import { Pool } from "pg";

export const Client = new Pool({
  connectionString: process.env.DATABASE_URL,
});
