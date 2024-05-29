import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Navbar from '../navbar/Navbar';
import { Sidebar, MobileSidebar } from '../sidebar/Sidebar';

export default function Layout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
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
        </Box>
    );
};
