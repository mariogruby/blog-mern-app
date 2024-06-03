import express from 'express';
import fileUpload from "express-fileupload";
import { isAuthenticated } from "../middlewares/jwt.js"
import { addPost, getPosts } from "../controllers/post.js"

const router = express.Router();
router.use(fileUpload());

router.post("/new-post", isAuthenticated, addPost);
router.get("/all-posts", getPosts)

export default router;