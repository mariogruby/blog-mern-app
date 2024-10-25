import { useEffect } from 'react';

export const useSocketUpdates = ( socket, setChats ) => {
    useEffect(() => {
        if (socket) {
            // Escuchar el evento de actualización de mensajes no leídos
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

        // Limpiar el listener cuando se desmonta el componente
        return () => {
            if (socket) {
                socket.off("unreadMessagesUpdate");
            }
        };
    }, [socket, setChats]);
}
