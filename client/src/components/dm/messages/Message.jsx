import React, { useContext } from 'react'
import { Box, Paper, Typography, Card, CardMedia, CardContent, Avatar } from '@mui/material'
import { AuthContext } from '../../../context/auth'
import useChat from '../../zustand/useChat'
import { extractTime } from '../utils/extractTime'

export default function Message({ message }) {
    const { user } = useContext(AuthContext)
    const { selectedChat } = useChat();
    const fromMe = message.senderId === user._id;
    const formattedTime = extractTime(message.createdAt);
    const chatJustifyContent = fromMe ? "flex-end" : "flex-start";
    const paperColor = fromMe ? "#3f51b5" : "#e0e0e0";
    const textColor = fromMe ? "white" : "black";

    return (
        <Box flex={1} padding="16px">
            <Box display="flex" flexDirection="column" gap="8px">
                <Box display="flex" justifyContent={chatJustifyContent}>
                    <Paper
                        elevation={1}
                        sx={{
                            padding: '12px',
                            backgroundColor: paperColor,
                            color: textColor,
                            borderRadius: '16px',
                            maxWidth: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: fromMe ? 'flex-end' : 'flex-start',
                        }}
                    >
                        <Typography>{message.message}</Typography>
                        {message.post && (
                            <Card sx={{ marginTop: '8px', width: '100%' }}>
                                {message.post.author && (
                                    <Box display="flex" alignItems="center" marginTop="8px">
                                        <Avatar alt={message.post.author.name} />
                                        <Typography variant="subtitle2" marginLeft="8px">
                                            {message.post.author.name}
                                        </Typography>
                                    </Box>
                                )}
                                <CardContent>
                                    {message.post.image && (
                                        <CardMedia
                                            component="img"
                                            image={message.post.image}
                                            alt={message.post.content}
                                        />
                                    )}
                                    <Typography variant="body1">{message.post.content}</Typography>
                                </CardContent>
                            </Card>
                        )}
                        <Typography
                            variant="caption"
                            sx={{ alignSelf: fromMe ? 'flex-end' : 'flex-start' }}
                        >
                            {formattedTime}
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
