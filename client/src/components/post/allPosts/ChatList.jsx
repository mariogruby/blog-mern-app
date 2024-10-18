import React from 'react';
import useChat from '../../zustand/useChat';
import { Avatar, ListItemButton, ListItemAvatar, ListItemText, Badge, Checkbox } from '@mui/material';
import { useSocketContext } from '../../../context/SocketContext';

export default function ChatList({ chat, lastIdx, isSelected, handleCheckboxChange }) {
    const { setSelectedChat } = useChat();
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(chat._id);

    return (
        <>
            <ListItemButton
                sx={{
                    borderBottom: lastIdx ? 'none' : '1px solid #6e6e6e',
                }}
                // onClick={() => setSelectedChat(chat)}
                >
                <ListItemAvatar>
                    <Badge
                        color={isOnline ? 'success' : 'default'}
                        overlap="circular"
                        variant={isOnline ? 'dot' : undefined}
                        sx={{
                            '& .MuiBadge-dot': {
                                width: 13,
                                height: 13,
                                minWidth: 13,
                                borderColor: 'black',
                                borderWidth: 2,
                                borderStyle: 'solid',
                            }
                        }}
                    >
                        <Avatar src={chat.userImage} />
                    </Badge>
                </ListItemAvatar>
                <ListItemText
                    id={`checkbox-list-label-${chat._id}`}
                    primary={chat.username}
                />
                <Checkbox
                    edge="end"
                    checked={isSelected} // Controla si está marcado o no
                    onClick={(e) => {
                        e.stopPropagation(); // Evitar la propagación para no disparar el onClick del ListItemButton
                        handleCheckboxChange(chat._id); // Llama a la función del padre para actualizar el estado
                        setSelectedChat(chat)
                    }}
                />
            </ListItemButton>
        </>
    );
}
