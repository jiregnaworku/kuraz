import { io } from "socket.io-client";

const socket = io("https://kuraz-backend-sin2.onrender.com", {
  autoConnect: false,
});

export default socket;
