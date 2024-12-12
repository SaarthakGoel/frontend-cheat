import { io } from "socket.io-client";

const socket = io(true ? 'https://server-cheat.onrender.com' :'http://localhost:3500');  // backend link in production

export default socket;