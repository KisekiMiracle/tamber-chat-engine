import { app } from "~/index";
import { Client } from "~/utils/db";

export function RouteTestQuery() {
  app.get("/api/test/query", async (_req, res) => {
    const resp = await Client.query(/* sql */ `
        SELECT * FROM users;
      `);

    res.status(201).send({
      success: true,
      response: resp.rows,
    });
  });
}
