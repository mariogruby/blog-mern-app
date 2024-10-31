import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useGetChats from '../dm/hooks/useGetChats';
import CloseIcon from '@mui/icons-material/Close';
import { InputBase, Avatar, Box, Slide, Toolbar, IconButton, AppBar, Divider, List, ListItemButton, ListItemText, Dialog } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function SearchModal({ open, onClose }) {
    const [search, setSearch] = useState("");
    const { allUsers } = useGetChats();
    const navigate = useNavigate();

    const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    const handleSearchUser = (user) => {
        if (user) {
            setSearch("");
            navigate(`/${user.username}`);
            onClose();
        } else {
            toast.error("Error");
        }
    };
    
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box style={{ flex: 1 }}>
                        <InputBase
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ ml: 2, flex: 1 }}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
            <List>
                {search && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user.id}>
                            <ListItemButton onClick={() => handleSearchUser(user)}>
                                <Avatar src={user.userImage} alt={user.username} sx={{ mr: 2 }} />
                                <ListItemText primary={user.username} />
                            </ListItemButton>
                            <Divider />
                        </div>
                    ))
                ) : (
                    search && <ListItemText primary="Not result found for this user" />
                )}
            </List>
        </Dialog>
    );
}    