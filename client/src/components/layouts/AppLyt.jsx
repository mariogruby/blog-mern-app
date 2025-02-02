import React, { useState, useContext } from 'react';
import AddPost from '../../components/post/addPost/AddPost';
import {
    Box,
    CssBaseline,
    SpeedDial,
    SpeedDialIcon,
    SpeedDialAction,
    useMediaQuery,
} from '@mui/material';
import { AuthContext } from '../../context/auth';
import ModalAddPost from '../post/addPost/ModalAddPost';
import Sidebar from '../sidebar/Sidebar';
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material';
import useChat from '../zustand/useChat';

export default function Layout({ children }) {
    const { isLoggedIn } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const { selectedChat } = useChat();

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {!selectedChat || !isMobile ? (
                <Sidebar />
            ) : null}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    ml: {
                        xs: 0,
                        sm: 0,
                        md: 30,
                        lg: 30,
                        xl: 30,
                    },
                    mb: location.pathname === '/dm' ? undefined : { xs: 10 },
                }}
            >
                {children}
            </Box>
            {location.pathname === '/' && isLoggedIn && (
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{
                        position: 'fixed',
                        bottom: isMobile ? 90 : 16,
                        right: 16,
                    }}
                    icon={<SpeedDialIcon />}
                >
                    <SpeedDialAction
                        icon={<AddIcon />}
                        tooltipTitle="Add new post"
                        onClick={handleModalOpen}
                    />
                </SpeedDial>
            )}
            <ModalAddPost open={isModalOpen} handleClose={handleModalClose}>
                <AddPost handleModalClose={handleModalClose} />
            </ModalAddPost>
        </Box>
    );
}
