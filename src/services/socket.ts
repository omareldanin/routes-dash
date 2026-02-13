import { io, Socket } from "socket.io-client";
import { baseURL } from "../api/api";

let socket: Socket;

export const connectSocket = () => {
  socket = io(baseURL, {
    transports: ["websocket"],
  });

  return socket;
};

export const getSocket = () => socket;
