import express from "express";
import { RouteTestQuery } from "./routes/test/query";

const app = express();
const port = 3210;

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

// Routing
RouteTestQuery();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app };
