import express from 'express';
import dotenv from 'dotenv';
import './db/index.js'; 
import authRoutes from "./routes/auth.js"
import configureApp from './config/index.js';
import handleErrors from './error-handling/index.js';

dotenv.config();

const app = express();

configureApp(app);

app.use("/auth", authRoutes)

handleErrors(app);

export default app;