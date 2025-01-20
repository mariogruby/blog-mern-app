import User from '../models/user.js'
import Post from '../models/post.js'
import bcrypt from "bcrypt";
import Notification from '../models/notification.js'
import Comment from '../models/comments.js';
import Conversation from '../models/conversation.js';
import cloudinaryConfig from '../config/cloudinary.js'
import { io, userSocketMap } from '../socket/socket.js'
import { response } from 'express';

const saltRounds = 10;

export const getUser = async (req, res) => {
    try {
        const username = req.params.username;

        const userData = await User.findOne({ username })
            .populate({
                path: 'userPost',
                select: '_id image likes comments',
            })
            .populate({
                path: 'followers.users',
                select: '_id username userImage',
            })
            .populate({
                path: 'following.users',
                select: '_id username userImage',
            });

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, userData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const followUser = async (req, res) => {
    try {
        const userId = req.payload._id.toString();
        const followUsername = req.params.username;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        //  Search user to follow/unfollow
        const followUser = await User.findOne({ username: followUsername });
        if (!followUser) {
            return res.status(404).json({ success: false, message: "User to follow/unfollow not found" });
        }

        const followUserId = followUser._id.toString();
        const isFollowing = user.following.users.includes(followUserId);

        if (isFollowing) {
            // unfollow user 
            user.following.users = user.following.users.filter(followingUser => followingUser.toString() !== followUserId);
            user.following.count -= 1;

            followUser.followers.users = followUser.followers.users.filter(follower => follower.toString() !== userId);
            followUser.followers.count -= 1;
        } else {
            // follow user
            user.following.users.push(followUserId);
            user.following.count += 1;

            followUser.followers.users.push(userId);
            followUser.followers.count += 1;
            const notification = new Notification({
                type: 'follower', // notification type
                user: userId, // user follow provide
            });
            await notification.save();

            const userOwner = await User.findById(followUserId); // user to push the notification
            userOwner.notifications.push(notification._id);
            await userOwner.save();

            const userOwnerId = userOwner._id.toString();
            const socketId = userSocketMap[userOwnerId];
            if (socketId) {
                io.to(socketId).emit("newNotification", {
                    type: 'follower',
                    user: userId,
                });
                console.log(`Notification emitted to: ${socketId}`);
            } else {
                console.log(`The socket associated with the user: ${userOwnerId} was not found `)
            }
        }

        await user.save();
        await followUser.save();

        return res.status(200).json({ success: true, message: isFollowing ? "No longer following the user" : "Now following the user" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const userLikedPost = async (req, res) => {
    try {
        const userId = req.payload._id;
        const user = await User.findById(userId).populate('likedPost.Post');

        if (!user) {
            return res.status(400).json({ success: false, message: 'User payload not found' });
        }

        return res.status(200).json({ success: true, likedPost: user.likedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

export const getSavedPosts = async (req, res) => {
    try {
        const userId = req.payload._id;

        const user = await User.findById(userId).populate({
            path: 'userSavedPost',
            populate: {
                path: 'author',
                select: 'username'
            },
            select: '_id image likes'
        })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.userSavedPost || user.userSavedPost.length === 0) {
            return res.status(200).json({ success: true, message: "User has no saved posts" })
        }

        return res.status(200).json({ success: true, savedPosts: user.userSavedPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const editUser = async (req, res) => {
    try {
        const userId = req.payload._id;
        const { name, lastName, username } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        let imageResult;

        if (req.files && req.files.image) {
            const imageBuffer = req.files.image.data;
            const imageBase64 = imageBuffer.toString('base64');

            imageResult = await cloudinaryConfig.uploader.upload(`data:image/png;base64,${imageBase64}`, {
                resource_type: "auto",
                folder: "uploads"
            });

            if (!imageResult) {
                return res.status(404).json({ success: false, message: "Upload image error" });
            }
        }

        user.name = name || user.name;
        user.lastName = lastName || user.lastName;
        user.username = username || user.username;
        if (imageResult) {
            user.userImage = imageResult.secure_url;
        }

        await user.save();

        return res.status(200).json({ success: true, message: "User updated successfully.", user });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const userId = req.payload._id;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(401).json({ success: false, message: "New password is required." });
        }

        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter."
            });
        }

        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        foundUser.password = hashedNewPassword;

        const updatedUser = await foundUser.save();
        res.status(200).json({ message: "User information updated successfully", user: updatedUser });
    } catch (error) {
        console.error("error in updateUser", error);
        res.status(500).json({ message: "Error updating user", error });
    }
};

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.payload._id;

        const conversations = await Conversation.find({
            participants: { $in: [loggedInUserId] }
        })
            .populate('_id participants', '-password')
            .populate({
                path: 'messages',
                populate: { path: 'senderId', select: 'username' }
            });

        if (!conversations) {
            return res.status(404).json({ success: false, message: "No conversations found" });
        }

        // Filters out participants who are not the logged in user and adds unread message count
        const participants = conversations.map(conversation => {
            const otherParticipant = conversation.participants.find(participant => participant._id.toString() !== loggedInUserId);

            // Check how many unread messages there are for the logged in user
            const unreadMessagesCount = conversation.unreadMessages?.get(loggedInUserId) || 0;

            // If the other participant no longer exists, return an object indicating this.
            if (!otherParticipant) {
                return {
                    _id: null,
                    username: "Account Deleted",
                    isDeleted: true,
                    unreadMessagesCount
                };
            }

            return {
                ...otherParticipant.toObject(),
                unreadMessagesCount
            };
        });

        // Get all users (except the logged in user) from the database
        const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        res.status(200).json({
            success: true,
            participants,
            allUsers
        });
    } catch (error) {
        console.log("Error in getUsersForSidebar", error.message);
        res.status(500).json({ success: false, error: "Internal server error." });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.payload._id

        const user = await User.findById(userId).populate({
            path: 'notifications',
            populate: [
                {
                    path: 'user',
                    select: 'username userImage',
                },
                {
                    path: 'post',
                    select: '_id image',
                }
            ],
            select: '_id createdAt read type',
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!user.notifications || user.notifications.length === 0) {
            return res.status(200).json({ success: true, message: "you don't have notifications", notifications: [] });
        }
        return res.status(200).json({ success: true, notifications: user.notifications })
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, message: 'Error in getNotifications controller' });
    }
};

export const markNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.payload._id;

        const user = await User.findById(userId).populate("notifications");
        if (!user || !user.notifications.length) {
            return res.status(200).json({ success: true, message: "No notifications to mark as read" });
        }

        const unreadNotifications = user.notifications.filter(notification => !notification.read);
        if (unreadNotifications.length === 0) {
            return res.status(200).json({ success: true, message: "All notifications are already read" });
        }

        // Mark as read
        await Notification.updateMany(
            { _id: { $in: unreadNotifications.map(n => n._id) } },
            { read: true }
        );

        return res.status(200).json({ success: true, message: "Notifications marked as read" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error marking notifications as read" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.payload._id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        await Post.deleteMany({ author: userId });

        await Notification.deleteMany({ userId });

        await Comment.deleteMany({ author: userId });

        await Conversation.deleteMany({
            $or: [
                { participants: userId },
                { sender: userId },
            ],
        });

        await User.findByIdAndDelete(userId);

        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        console.error(err, 'error in deleteUser controller');
        res.status(500).json({ success: false, message: err.message });
    }
};