import { useEffect } from 'react';

export const useSocketUpdates = ( socket, setChats ) => {
    useEffect(() => {
        if (socket) {
            // Listen the update event og unread messages
            socket.on("unreadMessagesUpdate", ({ senderId, unreadMessagesCount }) => {
                setChats(prevChats =>
                    prevChats.map(chat =>
                        chat._id === senderId
                            ? { ...chat, unreadMessagesCount }
                            : chat
                    )
                );
            });
        }
        // Clean listener when disassemble the component
        return () => {
            if (socket) {
                socket.off("unreadMessagesUpdate");
            }
        };
    }, [socket, setChats]);
}
