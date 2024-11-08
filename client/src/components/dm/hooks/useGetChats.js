import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/auth';
import userService from '../../../services/user';
import { toast } from 'react-toastify';

export default function useGetChats() {
    const { isLoggedIn } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const getChats = async () => {
            if (!isLoggedIn) return; 

            setLoading(true);
            try {
                const response = await userService.getUsers();
                const { participants, allUsers } = response.data;

                if (response.data.error) {
                    throw new Error(response.data.error);
                }
                setChats(participants);
                setAllUsers(allUsers);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        getChats();
    }, [isLoggedIn]);

    return { loading, chats, setChats, allUsers, setAllUsers };
}
