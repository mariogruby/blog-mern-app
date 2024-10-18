import React, { useEffect } from 'react'
import useChat from '../../zustand/useChat'
import { useSocketContext } from '../../../context/SocketContext'

export default function useListenMessages() {
    const { socket } = useSocketContext();
    const { messages, setMessages } = useChat();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            newMessage.shouldShake = true;
            console.log('Received new message:', newMessage);
            setMessages([...messages, newMessage])
        })

        return () => socket?.off("newMessage")
    }, [socket, setMessages, messages])
}
