import { useState, useEffect } from 'react';
import userService from '../../../services/user';

export const useNotificationsActions = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await userService.getNotifications();
            setNotifications(response.data.notifications || []);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000)
            console.log(response.data.notifications)
        } catch (e) {
            setIsLoading(false);
            console.log(e);
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
    }, []);

    return {
        notifications,
        errorMessage,
        isLoading,
        setNotifications,
        markNotificationsAsRead
    };
};
