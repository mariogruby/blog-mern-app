import express from 'express';
import { isAuthenticated } from '../middlewares/jwt.js';
import { getMessages, sendMessage, deleteChat } from '../controllers/message.js';

const router = express.Router();

router.get("/:id", isAuthenticated, getMessages)
router.post("/send/:id", isAuthenticated, sendMessage);
router.delete('/chat/:id', isAuthenticated, deleteChat);

export default router;