import Post from '../models/post.js'
import User from '../models/user.js'
import Notification from '../models/notification.js'
import cloudinaryConfig from '../config/cloudinary.js'
import { io, userSocketMap } from '../socket/socket.js';

export const addPost = async (req, res) => {
    try {
        const { content, tags } = req.body;

        const userId = req.payload._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const imageBuffer = req.files.image.data;
        const imageBase64 = imageBuffer.toString('base64');

        const imageResult = await cloudinaryConfig.uploader.upload(`data:image/png;base64,${imageBase64}`, {
            resource_type: "auto",
            folder: "uploads"
        });
        if (!imageResult) {
            return res.status(404).json({ success: false, message: "Upload image error" });
        }

        // Parse received tags as JSON string
        const tagsArray = tags ? JSON.parse(tags) : [];
        console.log('Tags como array:', tagsArray);

        const createPost = new Post({
            image: imageResult.secure_url,
            content,
            tags: tagsArray,
            author: user._id
        });

        await createPost.save();

        await User.findByIdAndUpdate(userId, {
            $push: { userPost: createPost._id }
        });

        return res.status(200).json({ success: true, post: createPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Error in server" });
    }
};

export const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const skip = (page - 1) * limit;
        const allPosts = await Post.find()
            .populate('author', '_id username userImage')
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(Number(limit));

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            success: true,
            allPosts,
            totalPages,
            currentPage: Number(page)
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: "Error getting all posts" })
    }
};

export const likePost = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.postId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Check if the user has already liked this post
        const likedPostIndex = user.likedPost.findIndex(like => like.Post.toString() === postId);

        if (likedPostIndex !== -1) {
            // If the user have given a like, then we remove the like.
            if (user.likedPost[likedPostIndex].liked) {
                user.likedPost.splice(likedPostIndex, 1);
                post.likes -= 1;
                post.likedBy.pull(userId); // Remove user from LikedBy field
            } else {
                // This case should not happen, but we handle it just in case
                user.likedPost[likedPostIndex].liked = true;
                post.likes += 1;
                post.likedBy.push(userId); // Add user to likedBy field
            }
        } else {
            // If the user has not interacted with the post before, we add a new like record
            user.likedPost.push({ Post: postId, liked: true });
            post.likes += 1;
            post.likedBy.push(userId); // Add user to likedBy field

            const notification = new Notification({
                type: 'like',
                post: postId,
                user: userId,
            });
            await notification.save();

            //Add notification to the user who owns the post
            const postOwner = await User.findById(post.author);
            postOwner.notifications.push(notification._id);
            await postOwner.save();

            // Issue notification via sockets
            const postOwnerId = postOwner._id.toString();
            const socketId = userSocketMap[postOwnerId];
            if (socketId) {
                io.to(socketId).emit("newNotification", {
                    type: 'like',
                    postId,
                    userId,
                });
                console.log(`Notification emitted to: ${socketId}`);
            } else {
                console.log(`The socket associated with the user: ${postOwnerId} was not found`);
            }
        }

        await user.save();
        await post.save();

        res.status(200).json({ success: true, message: "Post liked/unliked successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred while liking/unliking the post" });
    }
};


export const getPostById = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.postId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const post = await Post.findById(postId).populate('author', '_id username userImage');
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        return res.status(200).json({ success: true, post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Error getting the Post" });
    }
};

export const editPost = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.postId;
        const { content, tags } = req.body;


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Verify if the user try the edit post, is the author
        if (post.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        if (content) post.content = content;
        if (tags) post.tags = Array.isArray(tags) ? tags : [tags];

        await post.save();

        return res.status(200).json({ success: true, post });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error editing post" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.postId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // verify if the user try delete the post is the author
        if (post.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        await post.deleteOne();

        // delete post for the user post list
        user.userPost.pull(postId);
        await user.save();

        return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error deleting post" });
    }
};

export const savePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.payload._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const savedPostIndex = user.userSavedPost.findIndex(savedPost => savedPost.toString() === postId);

        if (savedPostIndex !== -1) {
            // Delete saved post
            user.userSavedPost.splice(savedPostIndex, 1);
            await user.save();
            return res.status(200).json({ success: true, message: "Post removed from saved posts" });
        }
        // Add post to saved posts
        user.userSavedPost.push(postId);
        await user.save();

        return res.status(200).json({ success: true, message: "Post saved successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
