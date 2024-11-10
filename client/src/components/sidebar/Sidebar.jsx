import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/auth';
import { useUserContext } from '../../context/user';
import { Link, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Badge,
    useMediaQuery,
    useTheme,
    Avatar
} from '@mui/material';
import {
    Inbox as InboxIcon,
    Home as HomeIcon,
    HomeOutlined as HomeOutlinedIcon,
    TurnedInNot as TurnedInNotIcon,
    TurnedIn as TurnedInIcon,
    SendOutlined as SendOutlinedIcon,
    Send as SendIcon,
    Menu as MenuIcon,
    Search as SearchIcon,
    SearchOutlined as SearchOutlinedIcon,
    Settings as SettingsIcon,
    SettingsOutlined as SettingsOutlinedIcon,
    NotificationsNoneOutlined as NotificationsNoneOutlinedIcon,
    Notifications as NotificationsIcon,
    Login as LoginIcon
} from '@mui/icons-material';
import SearchModal from './search/SearchModal'
import NotificationsModal from './notifications/Modal';
import useGetChats from '../dm/hooks/useGetChats';
import { useSocketContext } from '../../context/SocketContext';
import { useSocketUpdatesMessages, calculateUnreadMessagesCount, useSocketUpdatesNotifications, calculateUnreadNotificationsCount } from './Actions';
import { useNotificationsActions } from './notifications/Actions';

const drawerWidth = 240;

const Sidebar = () => {
    const location = useLocation();
    const { isLoggedIn } = useContext(AuthContext);
    const { userInfo } = useUserContext();
    const { chats, setChats } = useGetChats();
    const { socket } = useSocketContext();
    const [openModal, setOpenModal] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const { notifications, setNotifications, markNotificationsAsRead } = useNotificationsActions();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    //* search Modal
    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    //* notifications Modal
    const handleOpenNotifications = () => {
        markNotificationsAsRead(notifications, setNotifications);
        setOpenNotifications(true);
    };
    const handleCloseNotifications = () => {
        setOpenNotifications(false);
    };

    //* Usar los hooks para escuchar actualizaciones del socket
    useSocketUpdatesMessages(socket, setChats);
    useSocketUpdatesNotifications(socket, setNotifications);

    //* Calcular mensajes no leídos
    const unreadMessagesCount = calculateUnreadMessagesCount(chats);
    const unreadNotificationsCount = calculateUnreadNotificationsCount(notifications);

    return (
        <Drawer
            variant="permanent"
            anchor={isMobile ? 'bottom' : 'left'}
            sx={{

                '& .MuiDrawer-paper': {
                    width: isMobile ? '100%' : drawerWidth,
                    height: isMobile ? 72 : '100%',
                    boxSizing: 'border-box',
                    overflowX: isMobile ? 'hidden' : 'auto',
                    overflowY: isMobile ? 'hidden' : 'auto'
                },
            }}
            open
        >
            <List sx={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', justifyContent: 'space-around' }}>
                <ListItemButton key="Home" component={Link} to='/'>
                    <ListItemIcon>
                        {location.pathname === '/' ? (
                            <HomeIcon fontSize="large" />
                        ) : (
                            <HomeOutlinedIcon fontSize="large" />
                        )}
                    </ListItemIcon>
                    <ListItemText primary={isMobile ? "" : "Home"} />
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
                    <ListItemText primary={isMobile ? "" : "Messages"} />
                </ListItemButton>
                <ListItemButton key="Notifications" component="div" onClick={handleOpenNotifications}>
                    <ListItemIcon>
                        <Badge badgeContent={unreadNotificationsCount} color="error">
                            {location.pathname === '/notifications' ? (
                                <NotificationsIcon fontSize="large" />
                            ) : (
                                <NotificationsNoneOutlinedIcon fontSize="large" />
                            )}
                        </Badge>
                    </ListItemIcon>
                    <ListItemText primary={isMobile ? "" : "Notifications"} />
                </ListItemButton>
                <ListItemButton key="Search" component="div" onClick={handleOpenModal}>
                    <ListItemIcon>
                        <SearchIcon fontSize='large' />
                    </ListItemIcon>
                    <ListItemText primary={isMobile ? "" : "Search"} />
                </ListItemButton>
                <ListItemButton key="Saved" component={Link} to='/saved-posts'>
                    <ListItemIcon>
                        {location.pathname === '/saved-posts' ? (
                            <TurnedInIcon fontSize="large" />
                        ) : (
                            <TurnedInNotIcon fontSize="large" />
                        )}
                    </ListItemIcon>
                    <ListItemText primary={isMobile ? "" : "Saved"} />
                </ListItemButton>
                <ListItemButton key="More">
                    <ListItemIcon>
                            <MenuIcon fontSize='large' />
                    </ListItemIcon>
                    <ListItemText primary={isMobile ? "" : "More"} />
                </ListItemButton>
                {isLoggedIn ? (
                    <ListItemButton key="Profile" component={Link} to={userInfo ? `/${userInfo.username}` : '#'}>
                        <Avatar
                            sx={{ marginRight: 2.7, width: '35px', height: '35px' }}
                            src={userInfo?.userImage || ''}
                            alt="user image"
                        />
                        <ListItemText primary={isMobile ? "" : "Profile"} />
                    </ListItemButton>
                ) : (
                    <ListItemButton hey="Login" component={Link} to={'/login'}>
                        <ListItemIcon>
                            <LoginIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary={isMobile ? "" : "Login"} />
                    </ListItemButton>
                )}
            </List>
            <SearchModal open={openModal} onClose={handleCloseModal} />
            <NotificationsModal open={openNotifications} onClose={handleCloseNotifications} />
        </Drawer>
    );
};

export default Sidebar;

// // TODO: Modificar el navbar para dispositivos moviles al finalizar las funciones del sidebar
// const MobileSidebar = ({ mobileOpen, handleDrawerToggle }) => (
//     <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{
//             keepMounted: true, // Better open performance on mobile.
//         }}
//         sx={{
//             display: { xs: 'block', sm: 'none' },
//             '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
//         }}
//     >
//         <List>
//             <ListItemButton key="Home">
//                 <ListItemIcon>
//                     <HomeIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="Inbox" />
//             </ListItemButton>
//             <ListItemButton key="Starred">
//                 <ListItemIcon>
//                     <MailIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="Starred" />
//             </ListItemButton>
//             <ListItemButton key="Send email">
//                 <ListItemIcon>
//                     <InboxIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="Send email" />
//             </ListItemButton>
//             <ListItemButton key="Drafts">
//                 <ListItemIcon>
//                     <MailIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="Drafts" />
//             </ListItemButton>
//         </List>
//     </Drawer>
// );

// export { Sidebar, MobileSidebar };
