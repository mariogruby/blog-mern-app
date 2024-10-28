import React, { useState } from 'react';
import useChat from '../../zustand/useChat';
import useGetChats from '../../dm/hooks/useGetChats';
import { toast } from 'react-toastify';
import { InputBase, Avatar, Box, IconButton, List, ListItem, ListItemAvatar, ListItemText, AppBar, Toolbar } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export default function SearchInput() {
    const [search, setSearch] = useState("");
    const { setSelectedChat } = useChat();
    const { chats, allUsers } = useGetChats(); 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!search) return;
        if (search.length < 3) {
            return toast.error("Search term must be at least 3 characters long");
        }

        let chat = chats.find((c) => c.username.toLowerCase().includes(search.toLowerCase()));

        if (!chat) {
            chat = allUsers.find((user) => user.username.toLowerCase().includes(search.toLowerCase()));
        }

        if (chat) {
            setSelectedChat(chat);
            setSearch("");
        } else {
            toast.error("No such user found");
        }
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Box display="flex" alignItems="center" width="100%">
                    <form onSubmit={handleSubmit}>
                        <InputBase
                            placeholder="Search conversations..."
                            sx={{ ml: 1, flex: 1 }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <IconButton type="submit" edge="end">
                            <SearchIcon />
                        </IconButton>
                    </form>
                </Box>
            </Toolbar>
        </AppBar>
    );
}


//! INITIAL CODE SNIPPET
// import React from 'react'
// import { InputBase, Avatar, Box, IconButton, List, ListItem, ListItemAvatar, ListItemText, AppBar, Toolbar } from '@mui/material';
// import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';

// export default function SearchInput() {
//     return (
//         <AppBar position="sticky">
//             <Toolbar>
//                 <Box display="flex" alignItems="center" width="100%">
//                     <IconButton edge="start">
//                         <SearchIcon />
//                     </IconButton>
//                     <InputBase
//                         placeholder="Search conversations..."
//                         sx={{ ml: 1, flex: 1 }}
//                     />
//                     <IconButton edge="end">
//                         <CloseIcon />
//                     </IconButton>
//                 </Box>
//             </Toolbar>
//         </AppBar>
//     )
// }

