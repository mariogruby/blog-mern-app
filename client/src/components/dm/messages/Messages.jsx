import React, { useEffect, useRef } from 'react'
import { Box, Paper, Typography, Container } from '@mui/material'
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages'
import MessageSkeleton from '../skeletons/MessageSkeleton';
import useListenMessages from '../hooks/useListenMessages';

export default function Messages() {
    const { messages, loading } = useGetMessages();
    useListenMessages();
    const lastMessageRef = useRef();
    useEffect(()=> {
        setTimeout(()=> {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth"});
        },100)
    },[messages])
    return (
        <Box flex={1} padding="16px" height={"90%"} overflow="auto">
            {!loading &&
                messages.length > 0 &&
                messages.map((message) => (
                    <div key={message._id} ref={lastMessageRef}>
                        <Message message={message} />
                    </div>
                ))}
            {loading && <MessageSkeleton />}
            {!loading && messages.length === 0 && (
                <Container>
                    <Box
                        overflow="auto"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        height={450}
                    >
                        <Typography variant="subtitle1">Send a message to start the conversation</Typography>
                    </Box>
                </Container>
            )}
        </Box>
    )
}
