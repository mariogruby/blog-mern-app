import React, { useState } from 'react';
import { toast } from 'react-toastify';
import messageService from '../../../services/message';
import useChat from '../../zustand/useChat';

export default function useSendMessage() {

    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedChat } = useChat();

    const sendMessage = async (message, postId = null, chatId = null) => {
        const targetChatId = chatId || selectedChat?._id;
        if (!targetChatId) {
            toast.error('No chat selected');
            return;
        }
    
        setLoading(true);
        try {
            const response = await messageService.sendMessage(targetChatId, message, postId);
            const data = response.data.newMessage;
            if (data.error) throw new Error(data.error);
            setMessages([...messages, data]);
            // toast.success('Message sent successfully');
        } catch (error) {
            toast.error(error.message);
            console.log('error:', error.message);
        } finally {
            setLoading(false);
        }
    };
    
    
    return { sendMessage, loading };
}