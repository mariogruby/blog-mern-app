import express from 'express';
import fileUpload from "express-fileupload";
import { isAuthenticated } from "../middlewares/jwt.js";
import { addPost, getPosts, likePost, getPostById, editPost, deletePost, savePost } from "../controllers/post.js";

const router = express.Router();
router.use(fileUpload());

router.post("/new-post", isAuthenticated, addPost);
router.get("/all-posts", getPosts);
router.get("/:postId", isAuthenticated, getPostById);
router.post("/:postId/like", isAuthenticated, likePost);
router.post("/:postId/save", isAuthenticated, savePost);
router.put("/:postId/edit", isAuthenticated, editPost); 
router.delete("/:postId/delete", isAuthenticated, deletePost); 

export default router;
