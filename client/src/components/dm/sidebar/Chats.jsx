import React, { useState, useEffect } from 'react';
import { Box, List } from '@mui/material';
import Chat from './Chat'
import useGetChats from '../hooks/useGetChats';

export default function ChatsList() {
    const { loading, chats } = useGetChats();
    return (
        <Box flexGrow={1} height={600}>
            <List sx={{ flexGrow: 1 }}>
                {chats.map((chat, idx) => (
                    <Chat key={chat._id}
                    chat={chat}
                    lastIdx= {idx === chats.length -1}
                    />
                ))}
                {loading ? <p>LOADING..</p> : null}
            </List>
        </Box>
    )
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

