import { useEffect } from 'react';

// Escuchar las actualizaciones de mensajes no leídos desde el socket
export const useSocketUpdatesMessages = (socket, setChats) => {
    useEffect(() => {
        if (socket) {
            socket.on("unreadMessagesUpdate", ({ senderId, unreadMessagesCount }) => {
                setChats(prevChats =>
                    prevChats.map(chat =>
                        chat._id === senderId
                            ? { ...chat, unreadMessagesCount } // Actualizamos el chat con el nuevo count
                            : chat
                    )
                );
            });
        }

        return () => {
            if (socket) {
                socket.off("unreadMessagesUpdate");
            }
        };
    }, [socket, setChats]);
};

// Calcular el total de mensajes no leídos de manera segura
export const calculateUnreadMessagesCount = (chats) => {
    return chats.reduce((total, chat) => {
        return total + (chat.unreadMessagesCount ? chat.unreadMessagesCount : 0);
    }, 0);
};

export const useSocketUpdatesNotifications = (socket, setNotifications) => {
    useEffect(() => {
        if (socket) {
            socket.on("newNotification", (notification) => {
                console.log('Nueva notificación recibida:', notification);

                // Actualiza las notificaciones
                setNotifications((prevNotifications) => {
                    const updatedNotifications = [notification, ...prevNotifications];
                    return updatedNotifications;
                });
            });
        }

        return () => {
            if (socket) {
                socket.off("newNotification");
            }
        };
    }, [socket, setNotifications]);
};

export const calculateUnreadNotificationsCount = (notifications) => {
    return notifications.filter(notification => !notification.read).length;
};


