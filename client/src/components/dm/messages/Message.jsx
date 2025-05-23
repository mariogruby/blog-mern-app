import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Box, Paper, Typography, Card, CardMedia, CardContent, Avatar } from '@mui/material'
import { AuthContext } from '../../../context/auth'
import { extractTime } from '../utils/extractTime'

export default function Message({ message }) {
    const { user } = useContext(AuthContext)
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
                            <Card
                                component={Link}
                                to={`/post/${message.post._id}`}
                                sx={{
                                    marginTop: '8px',
                                    width: '100%',
                                    borderRadius: '16px'
                                }}
                            >
                                {message.post.author && (
                                    <Box display="flex" alignItems="center" marginTop="8px" marginLeft={2}>
                                        <Avatar src={message.post.author.userImage} alt={message.post.author.username} />
                                        <Typography variant="subtitle2" marginLeft="8px">
                                            {message.post.author.username}
                                        </Typography>
                                    </Box>
                                )}
                                <CardContent>
                                    {message.post.image && (
                                        <CardMedia
                                            sx={{ borderRadius: '5px' }}
                                            component="img"
                                            image={message.post.image}
                                            alt={message.post.content}
                                        />
                                    )}
                                    <Typography color="text.secondary">{message.post.content}</Typography>
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
