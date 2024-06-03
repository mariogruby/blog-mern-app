import React, { useState } from 'react';
import { Box, CssBaseline, SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import Navbar from '../navbar/Navbar';
import ModalAddPost from '../post/ModalAddPost';
import AddPost from '../post/AddPost'
import { Sidebar, MobileSidebar } from '../sidebar/Sidebar';
import AddIcon from '@mui/icons-material/Add';

export default function Layout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navbar handleDrawerToggle={handleDrawerToggle} />
            <Sidebar />
            <MobileSidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: { sm: 30 }, mt: 8 }}
            >
                {children}
            </Box>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                <SpeedDialAction
                    icon={<AddIcon />}
                    tooltipTitle="Add Post"
                    onClick={handleModalOpen} 
                />
            </SpeedDial>
            <ModalAddPost open={isModalOpen} handleClose={handleModalClose}>
                <AddPost />
            </ModalAddPost>
        </Box>
    );
};
