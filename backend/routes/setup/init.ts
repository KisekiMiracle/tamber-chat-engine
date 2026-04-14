import { app } from "~/index";
import { Client } from "~/utils/db";

export function SetupRouteSetup() {
  app.get("/api/setup/init", async (_req, res) => {
    // @ts-ignore
    await Client.query(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        displayname TEXT,
        status TEXT NOT NULL DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'UNAVAILABLE', 'OFFLINE')),
        status_emote TEXT,
        badges TEXT[] DEFAULT array[]::varchar[],
        created_at TIMESTAMP DEFAULT now(),
        CONSTRAINT fk_id
          FOREIGN KEY(user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
      );
    `);

    res.status(201).send({
      success: true,
    });
  });
}
