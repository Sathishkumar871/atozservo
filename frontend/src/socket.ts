// ✅ src/socket.ts
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; 
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;