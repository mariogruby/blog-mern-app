import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import ChatList from './ChatList';
import { toast } from 'react-toastify';
import useGetChats from '../../dm/hooks/useGetChats';
import useSendMessage from '../../dm/hooks/useSendMessage';

export default function ChatsListModal({ open, handleClose, postId }) {
    const { loading: chatsLoading, chats, allUsers } = useGetChats();
    const { sendMessage, loading: sending } = useSendMessage();
    const [message, setMessage] = useState('');
    const [checkedChats, setCheckedChats] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const combinedList = [
        ...chats, // Always show existing chats first
        ...(searchTerm.length > 0
            ? allUsers.filter((user) => !chats.some((chat) => chat._id === user._id))
            : []), // Add users only if there is a search
        ...Object.keys(checkedChats)
            .filter((chatId) => checkedChats[chatId]) // Make sure to include the selected ones
            .map((chatId) =>
                [...chats, ...allUsers].find((item) => item._id === chatId)
            )
    ].filter((item, index, self) =>
        // Remove duplicates while keeping selected items visible
        self.findIndex((i) => i._id === item._id) === index
    ).filter((item) =>
        // Filter by search only for unselected
        searchTerm.length === 0 || item.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manage chat selection
    const handleCheckboxChange = (chatId) => {
        setCheckedChats((prev) => ({
            ...prev,
            [chatId]: !prev[chatId],
        }));
    };

    // Determines if there are any chats selected
    const isAnyChatSelected = Object.values(checkedChats).some((isChecked) => isChecked);

    // Send messages to selected chats
    const handleSendMessage = async () => {
        if (!message && !postId) return;
        const selectedChats = Object.keys(checkedChats).filter((id) => checkedChats[id]);

        for (const chatId of selectedChats) {
            await sendMessage(message, postId, chatId);
        }
        handleClose();
        toast.success('Post sent successfully');
    };

    // Reset de state when modal is close
    useEffect(() => {
        if (!open) {
            setMessage('');
            setCheckedChats({});
            setSearchTerm('');
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Send Post</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column">
                    {/* Search bar*/}
                    <TextField
                        label="Search users or chats"
                        fullWidth
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    {/* List combined*/}
                    <Box overflow="auto" maxHeight={400}>
                        <List dense>
                            {combinedList.map((item, idx) => (
                                <ListItem key={item._id}>
                                    <ChatList
                                        chat={item}
                                        lastIdx={idx === combinedList.length - 1}
                                        isSelected={checkedChats[item._id] || false}
                                        handleCheckboxChange={handleCheckboxChange}
                                    />
                                </ListItem>
                            ))}
                            {chatsLoading && <div>Loading...</div>}
                        </List>
                    </Box>

                    {/* Write a message */}
                    <Box mt={2}>
                        <TextField
                            label="Message"
                            fullWidth
                            multiline
                            rows={2}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSendMessage}
                    color="primary"
                    disabled={sending || !isAnyChatSelected}
                >
                    {sending ? 'Sending...' : 'Send'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}