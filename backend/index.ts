import express from "express";
import { AuthRouteSetup } from "./routes/auth";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import SocketRoutes from "./routes/socket";

const app = express();
const port = 3210;
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://tamber.kiseki-miracle.dev",
  "https://hoppscotch.io", // ← add this for web Hoppscotch
  "http://localhost:3000", // ← add this if using Hoppscotch desktop app
];
const SECRET_KEY = "3uAqFu0ZrDs7Wur9eGx0HwTV6UFoASG2P5T6dqSyRhW";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
});

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

AuthRouteSetup();

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Handle client connections
io.on("connection", async (socket) => {
  console.log("Client connected");
  // Handle messages from the client
  socket.on("message", (message) => {
    console.log("Message received:", message);

    // Send message to all clients, including the one that sent the message
    io.emit("message", message);
  });

  await SocketRoutes(socket);
  console.log("User", socket.data.user);

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

export { app, io, SECRET_KEY };
