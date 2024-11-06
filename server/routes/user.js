import express from 'express';
import fileUpload from "express-fileupload";
import {
    userLikedPost,
    getSavedPosts,
    getUser,
    followUser,
    editUser,
    getUsersForSidebar,
    updatePassword, 
    // searchUsers
    getNotifications,
} from '../controllers/user.js'
import { isAuthenticated } from '../middlewares/jwt.js';

const router = express.Router();
router.use(fileUpload());

router.post("/:username/follow", isAuthenticated, followUser);
router.get("/:username/user-data", getUser);
router.get("/userLikedPosts", isAuthenticated, userLikedPost);
router.get("/userSavedPosts", isAuthenticated, getSavedPosts);
router.put("/edit-user", isAuthenticated, editUser);
router.get("/conversations", isAuthenticated, getUsersForSidebar);
// router.get("/users", isAuthenticated, searchUsers);
router.get("/notifications", isAuthenticated, getNotifications);
router.put("/update-password", isAuthenticated, updatePassword);

export default router;