import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/auth';
import userService from '../../../services/user';
import { toast } from 'react-toastify';

export const useNotificationsActions = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchData = async () => {
        if (!isLoggedIn) return;
        setIsLoading(true);
        try {
            const response = await userService.getNotifications();
            if (response.data.notifications.length === 0) {
                setErrorMessage(response.data.message)
            }
            setNotifications(response.data.notifications || []);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000)
        } catch (e) {
            setIsLoading(false);
            console.error(e.message);
            toast.error(e.message)
            setErrorMessage("error getting notifications");
        }
    }

    const markNotificationsAsRead = async () => {
        const unreadNotifications = notifications.filter(notification => !notification.read);
        if (unreadNotifications.length === 0) {
            console.log("No hay notificaciones no leídas.");
            return;  // Si no hay notificaciones no leídas, no actualices el estado
        }

        try {
            const response = await userService.markNotificationsAsRead();
            const updatedNotifications = notifications.map(notification => ({
                ...notification,
                read: true, // Marca todas como leídas
            }));
            setNotifications(updatedNotifications); // Actualiza el estado con las notificaciones leídas
            console.log('Notificaciones marcadas como leídas:', updatedNotifications);
        } catch (e) {
            console.log('Error al actualizar las notificaciones:', e);
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
        markNotificationsAsRead
    };
};
