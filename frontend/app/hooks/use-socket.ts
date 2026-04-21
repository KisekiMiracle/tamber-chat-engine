import { useEffect, useState, useCallback } from "react";
import { socket } from "../lib/socket";

interface UseSocketOptions {
  /** Connect automatically when the hook mounts. Default: true */
  autoConnect?: boolean;
}

interface UseSocketReturn {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: <T>(event: string, data?: T) => void;
}

export function useSocket({
  autoConnect = true,
}: UseSocketOptions = {}): UseSocketReturn {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (autoConnect && !socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [autoConnect]);

  const connect = useCallback(() => socket.connect(), []);
  const disconnect = useCallback(() => socket.disconnect(), []);
  const emit = useCallback(
    <T>(event: string, data?: T) => socket.emit(event, data),
    [],
  );

  return { isConnected, connect, disconnect, emit };
}

/**
 * Subscribe to a specific socket event with automatic cleanup.
 *
 * @example
 * const messages = [];
 * useSocketEvent<Message>("message", (msg) => setMessages(prev => [...prev, msg]));
 */
export function useSocketEvent<T>(event: string, handler: (data: T) => void) {
  useEffect(() => {
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);
}
