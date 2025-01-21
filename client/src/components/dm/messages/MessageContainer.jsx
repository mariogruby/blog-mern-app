import React, { useEffect, useState } from 'react';
import useChat from '../../zustand/useChat';
import {
    Container,
    Avatar,
    IconButton,
    Paper,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import Messages from './Messages';
import Menu from './Menu';
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import MessageInput from './MessageInput';
import { useUserContext } from '../../../context/user';
import useDeleteChat from '../hooks/useDeleteChat';

export default function MessageContainer({ chat }) {
    const { selectedChat, setSelectedChat, chatId, setChatId } = useChat();

    const { deleteChat, isLoading } = useDeleteChat();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    //* more Menu
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    //* handleDeleteChat
    const handleDeleteChat = async () => {
        if (selectedChat) {
            await deleteChat(chatId);
            setSelectedChat(null);
            setChatId(null);
            handleMenuClose();
        }
    };

    //* Dialog handlers
    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const confirmDeleteChat = () => {
        handleDeleteChat();
        closeDialog();
    };

    useEffect(() => {
        // cleanup function (unmounts)
        return () => setSelectedChat(null);
    }, [setSelectedChat]);

    return (
        <>
            {!selectedChat ? <NoChatSelected /> : (
                <React.Fragment>
                    <Box display="flex" flexDirection="column" height={{ xs: '100vh', sm: '100vh', md: 600, lg: 600, xl: 600 }}>
                        {/* header */}
                        <Paper
                            elevation={3}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap="8px" marginLeft={{ xs: 5, sm: 5, md: 0, lg: 0 }}>
                                <Avatar src={selectedChat.userImage} alt="User" sx={{ mr: 1 }} />
                                <Box>
                                    <Typography variant="subtitle1">{selectedChat.username}</Typography>
                                </Box>
                            </Box>
                            <Box display="flex" gap="8px">
                                <IconButton color="inherit" onClick={handleMenu}>
                                    <MoreHorizIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    handleMenuClose={handleMenuClose}
                                    deleteChatHandler={openDialog}
                                />
                            </Box>
                        </Paper>
                        <Messages />
                        <MessageInput />
                    </Box>
                </React.Fragment>
            )}

            {/* confirmation modal */}
            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>Confirm Delete Chat</DialogTitle>
                <DialogContent>
                    <Typography>
                    Are you sure you want to delete this chat? This action cannot be undone. The chat will be deleted for both users for security reasons.
                    </Typography>
                </DialogContent>
                <DialogActions disabled={isLoading}>
                    <Button onClick={closeDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteChat} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const NoChatSelected = () => {
    const { userInfo } = useUserContext();
    return (
        <Container>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height={600}
            >
                <Typography variant="h4" gutterBottom>
                    Hi, {userInfo.username}
                </Typography>
                <Typography variant="subtitle1">
                    Select a chat to start messaging
                </Typography>
            </Box>
        </Container>
    );
};
