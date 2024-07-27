import express from 'express';
import { isAuthenticated } from '../middlewares/jwt.js';
import { getMessages, sendMessage } from '../controllers/message.js';

const router = express.Router();

router.get("/:id", isAuthenticated, getMessages)
router.post("/send/:id", isAuthenticated, sendMessage);

export default router;