import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { useNotificationsActions } from './Actions';
import {
    Box,
    Tabs,
    Tab,
    List,
    ListItemText,
    ListItemButton,
    Divider,
    Avatar,
    Skeleton,
    Typography
} from '@mui/material';

export default function Notifications({ onClose }) {
    const [value, setValue] = useState(0);
    const { notifications, errorMessage, isLoading } = useNotificationsActions();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const likesList = notifications.filter(notification => notification.type === 'like');
    const commentsList = notifications.filter(notification => notification.type === 'comment');
    const followersList = notifications.filter(notification => notification.type === 'follower');

    const renderList = () => {
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
            );
        }

        if (errorMessage) {
            return <Typography color="error">{errorMessage}</Typography>;
        }

        let notificationsList;
        switch (value) {
            case 0:
                notificationsList = likesList;
                break;
            case 1:
                notificationsList = commentsList;
                break;
            case 2:
                notificationsList = followersList;
                break;
            default:
                notificationsList = [];
        }

        return (
            <List>
                {notificationsList.map((notification) => (
                    <React.Fragment key={notification._id}>
                        <ListItemButton sx={{ minHeight: 70 }}>
                            <Avatar
                                component={Link}
                                to={`/${notification.user.username}`}
                                src={notification.user.userImage}
                                alt="user image"
                                sx={{ marginRight: 2, width: 48, height: 48 }}
                                onClick={onClose}
                            />
                            <ListItemText
                                primary={`${notification.user.username} ${getNotificationMessage(notification.type)}`}
                            />
                            {(notification.type === 'like' || notification.type === 'comment') && (
                                <Avatar
                                    component={Link}
                                    to={`/post/${notification.post._id}`}
                                    src={notification.post.image}
                                    alt="post image"
                                    sx={{ marginLeft: 2, width: 50, height: 50 }}
                                    variant="rounded"
                                    onClick={onClose}
                                />
                            )}
                        </ListItemButton>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        );
    };

    const getNotificationMessage = (type) => {
        switch (type) {
            case 'like':
                return 'liked your post';
            case 'comment':
                return 'commented on your post';
            case 'follower':
                return 'started following you';
            default:
                return '';
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Likes" />
                <Tab label="Comments" />
                <Tab label="Followers" />
            </Tabs>
            <Box sx={{ p: 2 }}>
                {renderList()}
            </Box>
        </Box>
    );
}
