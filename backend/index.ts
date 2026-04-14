import express from "express";
import { RouteTestQuery } from "./routes/test/query";
import { SetupRouteSetup } from "./routes/setup/init";
import { AuthRouteSetup } from "./routes/auth";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
const port = 3210;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://tamber.kiseki-miracle.dev"],
    credentials: true,
  },
});

const SECRET_KEY = "3uAqFu0ZrDs7Wur9eGx0HwTV6UFoASG2P5T6dqSyRhW";

app.use(
  cors({
    origin: ["http://localhost:5173", "https://tamber.kiseki-miracle.dev"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

// Routing
// SetupRouteSetup();
AuthRouteSetup();

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Handle client connections
io.on("connection", (socket) => {
  console.log("Client connected");

  // Handle messages from the client
  socket.on("message", (message) => {
    console.log("Message received:", message);

    // Send message to all clients, including the one that sent the message
    io.emit("message", message);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

export { app, io, SECRET_KEY };
