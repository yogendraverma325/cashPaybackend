import { Server } from 'socket.io';
import server from '../common/server.js';

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

export default io
