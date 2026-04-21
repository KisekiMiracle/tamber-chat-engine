import { io, type Socket } from "socket.io-client";

const URL =
  import.meta.env.NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:3210";

// Singleton socket instance — one connection for the whole app
export const socket: Socket = io(URL, {
  withCredentials: true, // sends cookies automatically
  autoConnect: false, // we control when to connect
});
