import { useEffect } from 'react';

export const useSocketUpdatesMessages = (socket, setChats) => {
    useEffect(() => {
        if (socket) {
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

        return () => {
            if (socket) {
                socket.off("unreadMessagesUpdate");
            }
        };
    }, [socket, setChats]);
};

export const calculateUnreadMessagesCount = (chats) => {
    return chats.reduce((total, chat) => {
        return total + (chat.unreadMessagesCount ? chat.unreadMessagesCount : 0);
    }, 0);
};

export const useSocketUpdatesNotifications = (socket, setNotifications) => {
    useEffect(() => {
        if (socket) {
            socket.on("newNotification", (notification) => {
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