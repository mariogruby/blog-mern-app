import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Badge
} from '@mui/material';
import {
    Inbox as InboxIcon,
    Home as HomeIcon,
    HomeOutlined as HomeOutlinedIcon,
    TurnedInNot as TurnedInNotIcon,
    TurnedIn as TurnedInIcon,
    SendOutlined as SendOutlinedIcon,
    Send as SendIcon,
    Mail as MailIcon,
    Search as SearchIcon,
    SearchOutlined as SearchOutlinedIcon,
    Settings as SettingsIcon,
    SettingsOutlined as SettingsOutlinedIcon,
    NotificationsNoneOutlined as NotificationsNoneOutlinedIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';
import SearchModal from './SearchModal'
import useGetChats from '../dm/hooks/useGetChats';
import { useSocketContext } from '../../context/SocketContext';
import { useSocketUpdates, calculateUnreadMessagesCount } from './Actions';

const drawerWidth = 240;

const Sidebar = () => {
    const location = useLocation();
    const { chats, setChats } = useGetChats();
    const { socket } = useSocketContext();
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true); // Abre el modal
    };

    const handleCloseModal = () => {
        setOpenModal(false); // Cierra el modal
    };

    // Usamos la función para escuchar actualizaciones del socket
    useSocketUpdates(socket, setChats);

    // Usamos la función para calcular los mensajes no leídos
    const unreadMessagesCount = calculateUnreadMessagesCount(chats);

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
                <ListItemButton key="dm" component={Link} to='/dm'>
                    <ListItemIcon>
                        <Badge badgeContent={unreadMessagesCount} color="error">
                            {location.pathname === '/dm' ? (
                                <SendIcon fontSize="large" />
                            ) : (
                                <SendOutlinedIcon fontSize="large" />
                            )}
                        </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Messages" />
                    </ListItemButton>
                    <ListItemButton key="Notifications" component={Link} to={'/notifications'}>
                    <ListItemIcon>
                        {location.pathname === '/notifications' ? (
                            <NotificationsIcon fontSize='large' />
                        ) : (
                            <NotificationsNoneOutlinedIcon fontSize='large' />
                        )}
                    </ListItemIcon>
                    <ListItemText primary="Notifications" />
                </ListItemButton>
                <ListItemButton key="Drafts">
                    <ListItemIcon>
                        <MailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                </ListItemButton>
                <ListItemButton key="Search" component="div" onClick={handleOpenModal}>
                    <ListItemIcon>
                            <SearchIcon fontSize='large' />
                    </ListItemIcon>
                    <ListItemText primary="Search" />
                </ListItemButton>
                <ListItemButton key="Settings" component={Link} to={'/settings'}>
                    <ListItemIcon>
                        {location.pathname === '/settings' ? (
                            <SettingsIcon fontSize='large' />
                        ) : (
                            <SettingsOutlinedIcon fontSize='large' />
                        )}
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItemButton>
            </List>
            <SearchModal open={openModal} onClose={handleCloseModal} />
        </Drawer>
    );
};

export default Sidebar;


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
