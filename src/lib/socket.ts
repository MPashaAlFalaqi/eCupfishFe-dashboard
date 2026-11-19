import { io, type Socket } from "socket.io-client";
import { session } from "./api";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(BASE, {
      auth: { token: session.token },
      autoConnect: true,
    });
  }
  return socket;
}