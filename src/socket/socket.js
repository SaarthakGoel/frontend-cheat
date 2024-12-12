import { io } from "socket.io-client";

const socket = io('https://server-cheat.onrender.com');  // backend link in production

export default socket;

//http://localhost:3500