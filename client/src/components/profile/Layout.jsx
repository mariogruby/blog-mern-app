import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalFollowers from './userProfile/followers/Modal'
import ModalFollowings from './userProfile/followings/Modal';
import ModalEditUser from '../profile/editUser/ModalEditUser';
import EditUser from './editUser/EditUser';
import useGetChats from '../dm/hooks/useGetChats';
import useChat from '../zustand/useChat';
import { useUserProfileActions } from './userProfile/Actions';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Avatar,
    Skeleton,
} from '@mui/material';

export default function UserCard({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openModalFollowers, setOpenModalFollowers] = useState(false);
    const [openModalFollowings, setOpenModalFollowings] = useState(false);
    const navigate = useNavigate();
    const { setSelectedChat } = useChat();
    const { chats, allUsers } = useGetChats();

    const {
        userData,
        isLoading,
        error,
        followingCount,
        followersCount,
        userPosts,
        isFollowing,
        toggleFollowUser,
        isUserProfile,
    } = useUserProfileActions();

    //* followers Modal
    const handleOpenModalFollowers = () => {
        setOpenModalFollowers(true);
    };
    const handleCloseModalFollowers = () => {
        setOpenModalFollowers(false);
    };

    //* followings Modal
    const handleOpenModalFollowings = () => {
        setOpenModalFollowings(true);
    };
    const handleCloseModalFollowings = () => {
        setOpenModalFollowings(false);
    };

    const handleChatClick = () => {
        const { username } = userData;
        let chat = chats.find((c) => c.username.toLowerCase() === username.toLowerCase());
    
        if (!chat) {
            chat = allUsers.find((user) => user.username.toLowerCase() === username.toLowerCase());
        }
    
        if (chat) {
            setSelectedChat(chat);
            navigate('/dm?hideSidebar=true');
        } else {
            console.error("No chat found");
        }
    };
    

    if (isLoading) {
        return (
            <Box sx={{ margin: { xs: 0, xl: 5 }, marginLeft: { xs: 0, xl: 15 }, width: { xs: '100%', xl: '80%' }, position: 'relative', overflow: { xs: 'auto', sm: 'initial' } }}>
                <Card sx={{ display: 'flex', flexDirection: { xs: 'column', xl: 'row' }, alignItems: 'center', width: '100%', overflow: 'auto' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60%', marginBottom: 2 }}>
                        <Skeleton variant="circular" width={100} height={100} sx={{ marginTop: 2, marginBottom: 2 }} />
                        <Skeleton variant="text" width={200} height={40} />
                    </Box>
                    <CardContent sx={{ width: '100%', textAlign: 'center' }}>
                        <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 1.5, my: 1.5, display: 'flex', justifyContent: 'space-around', gap: 2, '& > div': { flex: 1 } }}>
                            <Skeleton variant="rectangular" width="100%" height={60} />
                            <Skeleton variant="rectangular" width="100%" height={60} />
                            <Skeleton variant="rectangular" width="100%" height={60} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', '& > button': { flex: 1 } }}>
                            <Skeleton variant="rectangular" width="100%" height={40} />
                            <Skeleton variant="rectangular" width="100%" height={40} />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <Box>
            <Box sx={{ margin: { xs: 0, xl: 5 }, marginLeft: { xs: 0, xl: 15 }, width: { xs: '100%', xl: '80%' }, position: 'relative', overflow: { xs: 'auto', sm: 'initial' } }}>
                <Card sx={{ display: 'flex', flexDirection: { xs: 'column', xl: 'row' }, alignItems: 'center', width: '100%', overflow: 'auto' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60%', marginBottom: 2 }}>
                        <Avatar src={userData.userImage} alt={userData.username} sx={{ width: { xs: 60, xl: 100 }, height: { xs: 60, xl: 100 }, marginTop: { xs: 2, xl: 2 }, marginLeft: { xs: 0, xl: 0 }, marginBottom: { xs: 2, xl: 0 }, borderRadius: '50%' }} />
                        <Typography variant="subtitle1" component="div">
                            @{userData.username}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {userData.name} {userData.lastName}
                        </Typography>
                    </Box>
                    <CardContent sx={{ width: '100%', textAlign: 'center' }}>
                        <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 1.5, my: 1.5, display: 'flex', justifyContent: 'space-around', gap: 2, '& > div': { flex: 1 } }}>
                            <div>
                                <Typography variant="body2" fontWeight="bold">Posts</Typography>
                                <Typography variant="h6">{userPosts.length}</Typography>
                            </div>
                            <div onClick={handleOpenModalFollowers}>
                                <Typography variant="body2" fontWeight="bold">Followers</Typography>
                                <Typography variant="h6">{followersCount}</Typography>
                            </div>
                            <div onClick={handleOpenModalFollowings}>
                                <Typography variant="body2" fontWeight="bold">Following</Typography>
                                <Typography variant="h6">{followingCount}</Typography>
                            </div>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', '& > button': { flex: 1 } }}>
                            {isUserProfile ? (
                                <Button variant="outlined" color="primary" onClick={handleModalOpen}>Edit</Button>
                            ) : (
                                <>
                                    <Button variant="outlined" color="primary" onClick={handleChatClick}>Chat</Button>
                                    <Button variant={isFollowing ? "contained" : "outlined"} color="primary" onClick={toggleFollowUser}>
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </Button>
                                </>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            <ModalFollowings open={openModalFollowings} onClose={handleCloseModalFollowings} />
            <ModalFollowers open={openModalFollowers} onClose={handleCloseModalFollowers} />
            <ModalEditUser open={isModalOpen} handleClose={handleModalClose}>
                <EditUser initialData={userData} handleModalClose={handleModalClose} />
            </ModalEditUser>
            {children}
        </Box>
    );
}
