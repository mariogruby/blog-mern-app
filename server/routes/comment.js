import express from 'express';
import { addComment, getCommentPost } from '../controllers/comment.js';
import { isAuthenticated } from '../middlewares/jwt.js';

const router = express.Router();

router.post('/:postId/add-comment', isAuthenticated, addComment);
router.get('/get-comments/:postId', getCommentPost);

export default router;
