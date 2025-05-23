import { useEffect, useState } from 'react';
import useChat from '../../zustand/useChat';
import { toast } from 'react-toastify';
import messageService from '../../../services/message';

export default function useGetMessages() {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedChat, setChatId } = useChat();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const response = await messageService.getMessages(selectedChat._id);
                const { success, messages, chatId, error } = response.data;
                // if(data.error)throw new Error(data.error);
                if (!success) throw new Error(error || 'Failed to fetch messages');
                // console.log('chatId:', chatId)
                setChatId(chatId);
                setMessages(messages);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedChat?._id) getMessages();
    }, [selectedChat?._id, setMessages, setChatId]);

    return { messages, loading };
}
