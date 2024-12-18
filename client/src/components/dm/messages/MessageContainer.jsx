import React, { useEffect } from 'react';
import useChat from '../../zustand/useChat'
import {
    Container,
    Avatar,
    IconButton,
    Paper,
    Typography,
    Box
} from '@mui/material';
import Messages from './Messages'
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import MessageInput from './MessageInput'
import { useUserContext } from '../../../context/user';

export default function MessageContainer({ chat }) {
    const { selectedChat, setSelectedChat } = useChat();

    useEffect(() => {
        // cleanup function (unmounts)
        return () => setSelectedChat(null);
    }, [setSelectedChat])

    return (
        <>
            {!selectedChat ? <NoChatSelected /> : (
                <React.Fragment>
                    <Box display="flex" flexDirection="column" height={{xs:'100vh', sm: '100vh', md: 600, lg: 600, xl: 600}}>
                        {/* header */}
                        <Paper
                            elevation={3}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px',
                                // backgroundColor: '#3f51b5',
                                // color: 'white'
                            }}
                        >
                            <Box display="flex" alignItems="center" gap="8px" marginLeft={{ xs: 5, sm: 5, md: 0, lg: 0 }}>
                                <Avatar src={selectedChat.userImage} alt="User" sx={{ mr: 1 }} />
                                <Box>
                                    <Typography variant="subtitle1">{selectedChat.username}</Typography>
                                </Box>
                            </Box>
                            <Box display="flex" gap="8px">
                                <IconButton color="inherit">
                                    <MoreHorizIcon />
                                </IconButton>
                            </Box>
                        </Paper>
                        <Messages />
                        <MessageInput />
                    </Box>
                </React.Fragment>
            )}
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
    )
}