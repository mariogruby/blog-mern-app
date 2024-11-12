import React from 'react';
import useChat from '../../zustand/useChat';
import { styled } from '@mui/material/styles';
import {
    Avatar,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Badge,
    Checkbox
} from '@mui/material';
import { useSocketContext } from '../../../context/SocketContext';

export default function ChatList({ chat, lastIdx, isSelected, handleCheckboxChange }) {
    const { setSelectedChat } = useChat();
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(chat._id);

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }));

    return (
        <>
            <ListItemButton
                sx={{
                    borderBottom: lastIdx ? 'none' : '1px solid #525252',
                }}
            >
                <ListItemAvatar>
                    <StyledBadge
                        color={isOnline ? 'success' : 'default'}
                        overlap="circular"
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        variant={isOnline ? 'dot' : undefined}
                    >
                        <Avatar src={chat.userImage} />
                    </StyledBadge>
                </ListItemAvatar>
                <ListItemText
                    id={`checkbox-list-label-${chat._id}`}
                    primary={chat.username}
                />
                <Checkbox
                    edge="end"
                    checked={isSelected}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(chat._id);
                        setSelectedChat(chat)
                    }}
                />
            </ListItemButton>
        </>
    );
}
