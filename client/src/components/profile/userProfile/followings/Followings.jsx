import React from 'react';
import { useUserProfileActions } from '../Actions';
import {
    Box,
    List,
    ListItemText,
    ListItemButton,
    Avatar,
    Typography,
    Divider,
    Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    PersonSearch as PersonSearchIcon,
    Error as ErrorIcon
} from '@mui/icons-material'

export default function Followers({ onClose }) {
    const navigate = useNavigate();
    const { userData, isLoading, followingSuccessMessage, error } = useUserProfileActions();

    if (isLoading) {
        return (
            <List>
                {[...Array(5)].map((_, index) => (
                    <React.Fragment key={index}>
                        <ListItemButton sx={{ minHeight: 70 }}>
                            <Skeleton variant="circular" width={40} height={40} sx={{ marginRight: 2 }} />
                            <ListItemText
                                primary={<Skeleton width="60%" />}
                                secondary={<Skeleton width="40%" />}
                            />
                            <Skeleton variant="rectangular" width={50} height={50} sx={{ marginLeft: 2 }} />
                        </ListItemButton>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        )
    }

    if (followingSuccessMessage) {
        return (
            <>
                {followingSuccessMessage && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '40vh',
                        textAlign: 'center',
                        fontSize: '18px'
                    }}>
                        <Typography> <PersonSearchIcon fontSize='large' /> {followingSuccessMessage}</Typography>
                    </Box>
                )}
            </>
        );
    }

    if (error) {
        return (
            <>
                {error && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '40vh',
                        textAlign: 'center',
                        fontSize: '18px',
                    }}>
                        <Typography color="error"><ErrorIcon fontSize='large' /> {error}</Typography>
                    </Box>
                )}
            </>
        );
    }

    //* this function is for a problem with transition close of Modal
    const handleUserClick = (username, navigate, onClose) => {
        onClose();
        setTimeout(() => {
            navigate(`/${username}`);
        }, 100);
    };

    return (
        <List>
            {userData.following.users.map((following) => (
                <React.Fragment key={following._id}>
                    <ListItemButton
                        onClick={() => handleUserClick(following.username, navigate, onClose)}
                    >
                        <Avatar
                            src={following.userImage}
                            alt="user image"
                            sx={{ marginRight: 2, width: 48, height: 48 }}
                        />
                        <ListItemText primary={following.username} />
                    </ListItemButton>
                    <Divider />
                </React.Fragment>
            ))}
        </List>
    );
}    