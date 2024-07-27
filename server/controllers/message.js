import Message from '../models/message.js'
import User from '../models/user.js'
import Conversation from '../models/conversation.js'
import { promiseHooks } from 'v8';

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.payload._id;
        const user = await User.findById(senderId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'user not found' });
        }
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

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
            return res.status(400).json({ success: false, message: "User not found" })
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // not reference but actual messages

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json({success: true, messages});
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ success: false, error: "Internal server error" })
    }
}
