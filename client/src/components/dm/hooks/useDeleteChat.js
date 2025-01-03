import { useState } from 'react';
import messageService from '../../../services/message';
import { toast } from 'react-toastify';

const useDeleteChat = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const deleteChat = async (conversationId) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            const response = await messageService.deleteChat(conversationId);
            if (response.status === 200) {
                setSuccess(true);
                toast.success("chat deleted");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while deleting the conversation.');
            toast.error("error deleting chat");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        deleteChat,
        isLoading,
        error,
        success,
    };
};

export default useDeleteChat;
