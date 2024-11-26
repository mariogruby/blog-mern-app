import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/auth';
import { useUserContext } from '../../context/user';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MoreOptions from './utils/Menu';
import AlertModal from '../alerts/NoAuth';
import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Badge,
    useMediaQuery,
    useTheme,
    Avatar,
} from '@mui/material';
import {
    Home as HomeIcon,
    HomeOutlined as HomeOutlinedIcon,
    TurnedInNot as TurnedInNotIcon,
    TurnedIn as TurnedInIcon,
    SendOutlined as SendOutlinedIcon,
    Send as SendIcon,
    Menu as MenuIcon,
    Search as SearchIcon,
    NotificationsNoneOutlined as NotificationsNoneOutlinedIcon,
    Notifications as NotificationsIcon,
    Login as LoginIcon
} from '@mui/icons-material';
import SearchModal from './search/SearchModal'
import NotificationsModal from './notifications/Modal';
import useGetChats from '../dm/hooks/useGetChats';
import { useSocketContext } from '../../context/SocketContext';
import {
    useSocketUpdatesMessages,
    calculateUnreadMessagesCount,
    useSocketUpdatesNotifications,
    calculateUnreadNotificationsCount,
} from './Actions';
import { useNotificationsActions } from './notifications/Actions';

const drawerWidth = 240;

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, logOutUser } = useContext(AuthContext);
    const { userInfo } = useUserContext();
    const { chats, setChats } = useGetChats();
    const { socket } = useSocketContext();
    const { notifications, setNotifications, markNotificationsAsRead } = useNotificationsActions();
    const [openModal, setOpenModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openNotifications, setOpenNotifications] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);

    //* Alert Modal
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    //* logout function
    function logOutHandler() {
        if (socket) {
            socket.disconnect();
        }
        logOutUser();
        navigate('/login')
    }

    //* more Menu
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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

    //* Hooks listener socket update
    useSocketUpdatesMessages(socket, setChats);
    useSocketUpdatesNotifications(socket, setNotifications);

    //* calculate unread messages
    const unreadMessagesCount = calculateUnreadMessagesCount(chats);
    //* calculate unread notifications
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
                <ListItemButton
                    key="dm"
                    onClick={() => {
                        !isLoggedIn ? setAlertOpen(true) : (window.location.href = '/dm');
                    }}
                >
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
                <ListItemButton
                    key="Notifications"
                    component="div"
                    onClick={(event) => !isLoggedIn ? setAlertOpen(true) : handleOpenNotifications(event)}
                >
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
                <ListItemButton
                    key="Search"
                    component="div"
                    onClick={(event) => !isLoggedIn ? setAlertOpen(true) : handleOpenModal(event)}
                >
                    <ListItemIcon>
                        <SearchIcon fontSize='large' />
                    </ListItemIcon>
                    <ListItemText primary={isMobile ? "" : "Search"} />
                </ListItemButton>
                <ListItemButton 
                key="Saved" 
                onClick={() => !isLoggedIn ? setAlertOpen(true) : (window.location.href = '/saved-posts')}
                >
                    <ListItemIcon>
                        {location.pathname === '/saved-posts' ? (
                            <TurnedInIcon fontSize="large" />
                        ) : (
                            <TurnedInNotIcon fontSize="large" />
                        )}
                    </ListItemIcon>
                    <ListItemText primary={isMobile ? "" : "Saved"} />
                </ListItemButton>
                <ListItemButton key="More" onClick={handleMenu}>
                    <ListItemIcon>
                        <MenuIcon fontSize='large' />
                    </ListItemIcon>
                    <ListItemText primary={isMobile ? "" : "More"} />
                </ListItemButton>
                <MoreOptions
                    anchorEl={anchorEl}
                    handleMenuClose={handleMenuClose}
                    logOutHandler={logOutHandler}
                />
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
                    <ListItemButton key="Login" component={Link} to={'/login'}>
                        <ListItemIcon>
                            <LoginIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary={isMobile ? "" : "Login"} />
                    </ListItemButton>
                )}
            </List>
            <SearchModal open={openModal} onClose={handleCloseModal} />
            <NotificationsModal open={openNotifications} onClose={handleCloseNotifications} />
            <AlertModal open={alertOpen} handleClose={handleAlertClose} />
        </Drawer>
    );
};