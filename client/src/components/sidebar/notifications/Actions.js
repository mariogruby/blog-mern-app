import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/auth';
import userService from '../../../services/user';
import { toast } from 'react-toastify';

export const useNotificationsActions = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const fetchData = async () => {
        if (!isLoggedIn) return;
        setIsLoading(true);
        try {
            const response = await userService.getNotifications();
            if (response.data.notifications.length === 0) {
                setSuccessMessage("You still don't have notifications")
            }
            setNotifications(response.data.notifications || []);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000)
        } catch (e) {
            setIsLoading(false);
            console.error(e.message);
            toast.error('Error getting notifications')
            setErrorMessage("Error getting notifications");
        }
    };

    const markNotificationsAsRead = async () => {
        const unreadNotifications = notifications.filter(notification => !notification.read);
        if (unreadNotifications.length === 0) return;
        try {
            await userService.markNotificationsAsRead();
            const updatedNotifications = notifications.map(notification => ({
                ...notification,
                read: true,
            }));
            setNotifications(updatedNotifications);
        } catch (e) {
            toast.error('Error update notifications')
        }
    };

    useEffect(() => {
        fetchData();
    }, [isLoggedIn]);

    return {
        notifications,
        errorMessage,
        isLoading,
        setNotifications,
        markNotificationsAsRead,
        successMessage
    };
};
