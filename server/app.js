import express from 'express';
import { app } from './socket/socket.js';
import dotenv from 'dotenv';
import './db/index.js';
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/post.js"
import userRoutes from "./routes/user.js"
import commentRoutes from "./routes/comment.js"
import messageRoutes from './routes/message.js';
import configureApp from './config/index.js';
import handleErrors from './error-handling/index.js';

dotenv.config();

// const app = express();

configureApp(app);
app.get('/', (req, res) => {
    res.status(200).send('Server is alive!');
});
app.use("/auth", authRoutes)
app.use("/posts", postRoutes)
app.use("/user", userRoutes)
app.use("/comment", commentRoutes)
app.use("/api/message", messageRoutes)

handleErrors(app);

export default app;