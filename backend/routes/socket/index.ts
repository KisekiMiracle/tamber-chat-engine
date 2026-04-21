import type { Socket } from "socket.io";
import { io } from "../../index";

const onlineUsers = new Map<string, Set<string>>();
export default async function SocketRoutes(socket: Socket) {
  // + ------------------------------------------------------- +
  // +  User Setup
  // + ------------------------------------------------------- +
  const res = await fetch("http://localhost:3210/api/auth/me", {
    method: "GET",
    credentials: "include",
    headers: {
      cookie: socket.handshake.headers.cookie ?? "",
    },
  });

  const { success, user } = (await res.json()) as any;
  if (!success) return socket.disconnect();

  socket.data.user = user;

  // + ------------------------------------------------------- +
  // +  Online Presence
  // + ------------------------------------------------------- +
  const userId = user.id;

  // Add this socket to the user's set
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId)!.add(socket.id);

  // Join a personal room for cross-tab broadcasts
  socket.join(`user:${userId}`);

  // Broadcast updated online list to everyone
  io.emit("online_users", Array.from(onlineUsers.keys()));

  // NOTE: User joins any room
  socket.on("join_room", (roomId) => {
    socket.join(`room:${roomId}`);
  });

  // + ------------------------------------------------------- +
  // +  Cleanup on Disconnect
  // + ------------------------------------------------------- +
  socket.on("disconnect", () => {
    const tabs = onlineUsers.get(userId);
    if (tabs) {
      tabs.delete(socket.id);
      // Only mark user as offline when ALL their tabs are closed
      if (tabs.size === 0) {
        onlineUsers.delete(userId);
        io.emit("online_users", Array.from(onlineUsers.keys()));
      }
    }
  });
}

export const isUserOnline = (userId: string) => onlineUsers.has(userId);
