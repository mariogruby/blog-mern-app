import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import { AuthContext } from '../../context/auth';
import { useSocketContext } from '../../context/SocketContext';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar({ handleDrawerToggle }) {
    const { logOutUser } = useContext(AuthContext);
    const { socket } = useSocketContext();

    function logOutHandler() {
        if (socket) {
            socket.disconnect(); // Desconecta el socket antes de cerrar sesión
        }
        logOutUser();
    }

    return (
        <Box>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Navbar
                    </Typography>
                    <Link to='/login'>
                        <Button color="inherit">Login</Button>
                    </Link>
                    <Button color="inherit" onClick={logOutHandler}>logout</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
