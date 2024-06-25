import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    IconButton,
    ListItemButton
} from '@mui/material';
import {
    Inbox as InboxIcon,
    Mail as MailIcon,
    ChevronLeft as ChevronLeftIcon,
    Home as HomeIcon,
    HomeOutlined as HomeOutlinedIcon,
    TurnedInNot as TurnedInNotIcon,
    TurnedIn as TurnedInIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = () => {
    const location = useLocation();

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', marginTop: '60px' },
            }}
            open
        >
            <List>
                <ListItemButton key="Home" component={Link} to='/'>
                    <ListItemIcon>
                        {location.pathname === '/' ? (
                            <HomeIcon fontSize="large" />
                        ) : (
                            <HomeOutlinedIcon fontSize="large" />
                        )}
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton key="Saved" component={Link} to='/saved-posts'>
                    <ListItemIcon>
                        {location.pathname === '/saved-posts' ? (
                            <TurnedInIcon fontSize="large" />
                        ) : (
                            <TurnedInNotIcon fontSize="large" />
                        )}
                    </ListItemIcon>
                    <ListItemText primary="Saved" />
                </ListItemButton>
                <ListItemButton key="Inbox">
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Send email" />
                </ListItemButton>
                <ListItemButton key="Drafts">
                    <ListItemIcon>
                        <MailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                </ListItemButton>
            </List>
        </Drawer>
    );
};

const MobileSidebar = ({ mobileOpen, handleDrawerToggle }) => (
    <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
            keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
    >
        <List>
            <ListItemButton key="Home">
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
            </ListItemButton>
            <ListItemButton key="Starred">
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Starred" />
            </ListItemButton>
            <ListItemButton key="Send email">
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Send email" />
            </ListItemButton>
            <ListItemButton key="Drafts">
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
            </ListItemButton>
        </List>
    </Drawer>
);

export { Sidebar, MobileSidebar };
