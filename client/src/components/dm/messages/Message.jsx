import React, { useContext } from 'react'
import { Box, Paper, Typography } from '@mui/material'
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
    // const shakeClass = message.shouldShake ? "shake" : "";

    return (
        <Box
            flex={1}
            padding="16px"
        >
            <Box display="flex" flexDirection="column" gap="8px">
                <Box display="flex" justifyContent={chatJustifyContent}>
                    <Paper
                        elevation={1}
                        // className={shakeClass}
                        sx={{
                            padding: '12px',
                            backgroundColor: paperColor,
                            color: textColor,
                            borderRadius: '16px',
                            maxWidth: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: fromMe ? 'flex-end' : 'flex-start' // Alinea el contenido según el remitente
                        }}
                    >
                        <Typography>{message.message}</Typography>
                        <Typography variant="caption" sx={{ alignSelf: fromMe ? 'flex-end' : 'flex-start' }}>
                            {formattedTime}
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </Box>
    )
}
