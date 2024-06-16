import express from 'express';
import { userLikedPost, getSavedPosts } from '../controllers/user.js'
import { isAuthenticated } from '../middlewares/jwt.js';

const router = express.Router();

router.get("/userLikedPosts", isAuthenticated, userLikedPost);
router.get("/userSavedPosts", isAuthenticated, getSavedPosts);

export default router;