import app from './app.js';
import dotenv from 'dotenv';
import * as Server from 'socket.io';

dotenv.config();

const PORT = process.env.PORT || 5005;

const server = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
const io = new Server.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    },
});
io.on('connection', (socket) => {
    socket.on('setup', (userData) => {
        socket.join(userData.id);
        socket.emit('connected');
    });
    socket.on('join room', (room) => {
        socket.join(room);
    });
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessageRecieve) => {
        var chat = newMessageRecieve.chatId;
        if (!chat.users) console.log('chats.users is not defined');
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieve.sender._id) return;
            socket.in(user._id).emit('message recieved', newMessageRecieve);
        });
    });
});