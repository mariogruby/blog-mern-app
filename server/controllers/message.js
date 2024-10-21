import Message from '../models/message.js'
import User from '../models/user.js'
import Post from '../models/post.js'  // Asegúrate de importar el modelo Post
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

        // Verificar si el mensaje está vacío o solo contiene espacios
        const trimmedMessage = message?.trim(); // Elimina espacios en blanco
        if (!trimmedMessage && !postId) {
            return res.status(400).json({ success: false, message: 'Message cannot be empty' });
        }

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
            message: trimmedMessage || null, // Si el mensaje está vacío, guarda null
            post: post ? post._id : null,    // Asocia el post si existe
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        // Funcionalidad de SOCKET.IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

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
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate({
            path: 'messages',
            populate: {
                path: 'post', // Popula el campo post en cada mensaje
                select: 'content image author', // Solo selecciona los campos necesarios
                populate: {
                    path: 'author', // Popula el autor del post con los detalles
                    select: 'name', // Solo selecciona el nombre del autor
                },
            },
        });

        if (!conversation) {
            return res.status(200).json({ success: true, messages: [] });
        }

        const messages = conversation.messages;

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};
