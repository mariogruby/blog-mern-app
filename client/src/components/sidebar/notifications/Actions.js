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

    useEffect(() => {
        fetchData();
    }, []);

    return {
        notifications,
        errorMessage,
        isLoading
    };
};
