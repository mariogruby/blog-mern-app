import React from 'react';
import {
    Box,
    List,
    Skeleton,
    ListItemButton,
    Divider,
} from '@mui/material';
import Chat from './Chat';
import useGetChats from '../hooks/useGetChats';
import { useSocketContext } from '../../../context/SocketContext';
import { useSocketUpdates } from './Actions';

export default function Chats({ onChatSelect }) {
    const { loading, chats, setChats } = useGetChats();
    const { socket } = useSocketContext();
    useSocketUpdates(socket, setChats);

    return (
        <Box flexGrow={1} height={600}>
            {loading ? ( 
                <List>
                    {[...Array(5)].map((_, index) => (
                        <React.Fragment key={index}>
                            <ListItemButton>
                                <Skeleton
                                    variant="circular"
                                    animation="wave"
                                    width={45}
                                    height={45}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    width={100}
                                    height={10}
                                    sx={{ marginLeft: 2 }}
                                />
                            </ListItemButton>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            ) : (
                <List sx={{ flexGrow: 1 }}>
                    {chats.map((chat, idx) => (
                        <Chat
                            key={chat._id}
                            chat={chat}
                            lastIdx={idx === chats.length - 1}
                            onChatSelect={onChatSelect}
                        />
                    ))}
                </List>
            )}
        </Box>
    );
    
}


//! INITIAL CODE SNIPPET
// import React, { useState, useEffect } from 'react';
// import { InputBase, Avatar, Box, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, AppBar, Toolbar } from '@mui/material';
// import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
// import { Link } from 'react-router-dom';
// import Chat from './Chat'

// export default function ChatsList() {
//     return (
//         <Box flexGrow={1} >
//             <List sx={{ flexGrow: 1, height: '70vh' }}>
//                 <Chat />
//                 <Chat />
//                 <Chat />
//                 <Chat />
//                 <Chat />
//             </List>
//         </Box>
//     )
// }

