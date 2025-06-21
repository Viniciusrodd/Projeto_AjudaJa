
import { io } from 'socket.io-client';

const socket = io('http://localhost:2130', {
    transports: ['websocket'],
    withCredentials: true
});

export default socket;