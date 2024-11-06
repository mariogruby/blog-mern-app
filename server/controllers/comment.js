import Comment from '../models/comments.js';
import Post from '../models/post.js';
import User from '../models/user.js';
import Notification from '../models/notification.js';
import { io } from '../socket/socket.js'

export const addComment = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.postId;
        const { content } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        };
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        };
        if (!content) {
            return res.status(400).json({ success: false, message: 'Content is required.' });
        };

        const notification = new Notification({
            type: 'comment',
            post: postId,
            user: userId,
        })
        await notification.save();

        const postOwner = await User.findById(post.author);
        postOwner.notifications.push(notification._id);
        await postOwner.save();

        io.emit("newNotification", {
            type: 'comment',
            postId,
            userId,
        })

        const createComment = new Comment({
            content,
            author: user._id
        });
        await createComment.save();
        await Post.findByIdAndUpdate(postId, {
            $push: { comments: createComment._id }
        });

        return res.status(200).json({ success: true, comment: createComment, message: "Comment created" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
    }
}

export const getCommentPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId).populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username userImage' // Selecciona solo los campos necesarios del autor
            },
            select: 'content author createdAt' // Selecciona solo el contenido del comentario y el autor
        });

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (!post.comments.length) {
            return res.status(404).json({ success: false, message: "No comments in post" });
        }

        return res.status(200).json({ success: true, comments: post.comments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "server error" });
    }
};