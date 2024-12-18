import React, { useState } from 'react';
import { Paper, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import useSendMessage from '../hooks/useSendMessage';

export default function MessageInput() {
    const [message, setMessage] = useState("");
    const { loading, sendMessage } = useSendMessage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
        await sendMessage(message);
        setMessage("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <Paper
                elevation={1}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    minHeight: '60px',
                    width: '100%',
                }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Type your message..."
                    fullWidth
                    multiline
                    maxRows={4}
                    minRows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{
                        flexGrow: 1,
                        borderRadius: '16px',
                        '& textarea': {
                            resize: 'none',
                        },
                        '& fieldset': {
                            borderRadius: '16px',
                        },
                    }}
                />
                <IconButton
                    type="submit"
                    color="primary"
                    sx={{ marginLeft: '8px' }}
                    disabled={!message.trim()}
                >
                    {loading ? 'Sending...' : <SendIcon />}
                </IconButton>
            </Paper>
        </form>
    );
}
