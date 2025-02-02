import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import dotenv from "dotenv";

dotenv.config();

const app = express();

const server = http.createServer(app);
const origin = process.env.NODE_ENV === 'production'
    ? ['https://omega-social-network.vercel.app'] 
    : ['http://localhost:3000'];

const io = new Server(server, {
    cors: {
        origin: origin,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server, userSocketMap }