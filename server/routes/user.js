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
    markNotificationsAsRead,
    deleteUser
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
router.put("/notifications/mark-as-read", isAuthenticated, markNotificationsAsRead);
router.put("/update-password", isAuthenticated, updatePassword);
router.delete("/delete-account", isAuthenticated, deleteUser);

export default router;