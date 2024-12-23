import { io } from "socket.io-client";

const socket = io('http://localhost:3500');  // backend link in production

export default socket;

//http://localhost:3500
//https://server-cheat.onrender.com