import React, { useEffect, useContext } from 'react';
import useChat from '../../zustand/useChat'
import { Container, Avatar, IconButton, TextField, Paper, Typography, Box } from '@mui/material';
import Messages from './Messages'
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import MessageInput from './MessageInput'
import { styled } from '@mui/material/styles';
import { AuthContext } from '../../../context/auth';
import { useUserContext } from '../../../context/user';
import { useSocketContext } from '../../../context/SocketContext';

export default function MessageContainer({chat}) {
    const {selectedChat, setSelectedChat} = useChat();
    const { onlineUsers } = useSocketContext();

    useEffect(()=> {
        // cleanup function (unmounts)
        return () => setSelectedChat(null);
    }, [setSelectedChat])

    return (
        <>
            {!selectedChat ? <NoChatSelected /> : (
                <React.Fragment>
                    <Box display="flex" flexDirection="column" height={600}>
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
                            <Box display="flex" alignItems="center" gap="8px">
                                <Avatar src={selectedChat.userImage} alt="User" sx={{mr:1}} />
                                <Box>
                                    <Typography variant="subtitle1">{selectedChat.username}</Typography>
                                    <Typography variant="body2">
                                        {/* {!isOnline ? 'Offline': 'Online'} */}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" gap="8px">
                                {/* <IconButton color="inherit">
                                    <SearchIcon />
                                </IconButton> */}
                                <IconButton color="inherit">
                                    <MoreHorizIcon />
                                </IconButton>
                            </Box>
                        </Paper>
                        {/* chat */}
                        {/* <Box flex={1} padding="16px" height={450}  overflow="auto"> */}
                            <Messages />
                        {/* </Box> */}
                        {/* textArea */}
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