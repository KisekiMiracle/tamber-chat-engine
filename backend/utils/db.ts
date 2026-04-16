import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "~/db/schema";

export const Client = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(Client, { schema });
