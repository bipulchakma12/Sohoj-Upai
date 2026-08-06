import { io, Socket } from "socket.io-client";

let clientSocket: Socket | null = null;

// Client Socket helper for React components
export const getSocket = (): Socket => {
  if (typeof window === "undefined") {
    // If called on server side, return a dummy socket mock
    return {
      connected: false,
      connect: () => {},
      disconnect: () => {},
      on: () => {},
      off: () => {},
      emit: () => {},
    } as unknown as Socket;
  }

  if (!clientSocket) {
    clientSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
      autoConnect: false,
    });
  }
  return clientSocket;
};

// Safe event emitter helper for API routes & server environments
export const emitSocketEvent = (event: string, data: any) => {
  try {
    console.log(`[Socket Event Triggered: ${event}]`, data?.bookingId || data);
  } catch (err) {
    console.warn("Socket event emit warning:", err);
  }
};
