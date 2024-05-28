import React from 'react';
import { AppBar, Box } from '@mui/material';
import Navbar from '../navbar/Navbar';

export default function AppLayout({ children }) {
    return (
        <Box display="flex">
            <AppBar position="fixed" sx={{ zIndex: 1200 }}>
                <Navbar />
            </AppBar>
            <Box component="main" flexGrow={1} mt={8}> {/* mt={8} to offset for the AppBar */}
                <Box display="flex">
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
