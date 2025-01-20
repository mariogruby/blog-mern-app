import Message from '../models/message.js'
import User from '../models/user.js'
import Post from '../models/post.js'
import Conversation from '../models/conversation.js'
import { getReceiverSocketId, io } from '../socket/socket.js';

export const sendMessage = async (req, res) => {
    try {
        const { message, postId } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.payload._id;

        const user = await User.findById(senderId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let post = null;
        if (postId) {
            post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
        }

        const trimmedMessage = message?.trim();
        if (!trimmedMessage && !postId) {
            return res.status(400).json({ success: false, message: 'Message cannot be empty' });
        }

        // verify conversation exist
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message: trimmedMessage || null,
            post: post ? post._id : null,
        });

        conversation.messages.push(newMessage._id);

        // Updates the unread message counter for the recipient
        conversation.unreadMessages.set(receiverId, (conversation.unreadMessages.get(receiverId) || 0) + 1);

        await Promise.all([conversation.save(), newMessage.save()]);

        // Emitting the new message event via Socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);

            // Send unread message notification to recipient
            io.to(receiverSocketId).emit("unreadMessagesUpdate", {
                senderId,
                unreadMessagesCount: conversation.unreadMessages.get(receiverId),
            });
        }

        // Also forward the new message to the sender (if necessary)
        io.to(req.socket.id).emit("newMessage", newMessage);

        res.status(201).json({ success: true, message: "Message sent successfully", newMessage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.payload._id;

        const user = await User.findById(senderId);
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate({
            path: '_id messages',
            populate: {
                path: 'post',
                select: '_id content image author',
                populate: { path: 'author', select: 'username userImage' },
            },
        });

        if (conversation) {
            // Resets the unread message counter for the current user
            conversation.unreadMessages.set(senderId, 0);
            await conversation.save();
        }

        res.status(200).json({
            success: true,
            messages: conversation?.messages || [],
            chatId: conversation?._id
        });
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const deleteChat = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const userId = req.payload._id;

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this conversation" });
        }

        await Message.deleteMany({ _id: { $in: conversation.messages } });

        await conversation.deleteOne();

        res.status(200).json({ success: true, message: "Chat deleted successfully" });
    } catch (error) {
        console.log("Error in deleteChat controller", error.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};