import { useState, useCallback } from "react";
import type { Message } from "react-hook-form";
import { useSocket, useSocketEvent } from "~/hooks/use-socket";
import type { Route } from "./+types/page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat | Tamber Engine" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function ChatPage() {
  return (
    <section>
      <h1>Chat</h1>
      <MessageList />
      <Chat />
    </section>
  );
}

// Connect and send messages
function Chat() {
  const { isConnected, emit } = useSocket();

  return (
    <button onClick={() => emit("message", { text: "Hello!" })}>
      {isConnected ? "Send" : "Connecting..."}
    </button>
  );
}

// Listen for events in any component
function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useSocketEvent<Message>(
    "message",
    useCallback((msg) => {
      setMessages((prev) => [...prev, msg]);
    }, []),
  );

  return (
    <ul>
      {messages.map((m) => (
        // @ts-ignore
        <li>{m.text}</li>
      ))}
    </ul>
  );
}
