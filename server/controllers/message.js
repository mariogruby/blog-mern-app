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

        // Verificar que el usuario existe
        const user = await User.findById(senderId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verificar si el post existe si se envía un postId
        let post = null;
        if (postId) {
            post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
        }

        // Verificar que el mensaje no esté vacío
        const trimmedMessage = message?.trim();
        if (!trimmedMessage && !postId) {
            return res.status(400).json({ success: false, message: 'Message cannot be empty' });
        }

        // Verificar la conversación
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

        // Actualizar el contador de mensajes no leídos para el receptor
        conversation.unreadMessages.set(receiverId, (conversation.unreadMessages.get(receiverId) || 0) + 1);

        await Promise.all([conversation.save(), newMessage.save()]);

        // Emitir el evento de nuevo mensaje por Socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);

            // Emitir notificación de mensajes no leídos al receptor
            io.to(receiverSocketId).emit("unreadMessagesUpdate", {
                senderId,
                unreadMessagesCount: conversation.unreadMessages.get(receiverId),
            });
        }

        // También emitir el nuevo mensaje al remitente (si es necesario)
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
            // Restablece el contador de mensajes no leídos para el usuario actual
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
        const { id: conversationId } = req.params; // ID de la conversación pasado como parámetro
        const userId = req.payload._id; // ID del usuario autenticado

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        // Verificar que la conversación existe
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        // Verificar que el usuario es participante de la conversación
        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this conversation" });
        }

        // Eliminar todos los mensajes asociados a la conversación
        await Message.deleteMany({ _id: { $in: conversation.messages } });

        // Eliminar la conversación
        await conversation.deleteOne();

        res.status(200).json({ success: true, message: "Chat deleted successfully" });
    } catch (error) {
        console.log("Error in deleteChat controller", error.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};