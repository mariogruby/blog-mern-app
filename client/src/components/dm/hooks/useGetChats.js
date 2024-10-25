// import React, { useState, useEffect } from 'react'
// import userService from '../../../services/user'
// import { toast } from 'react-toastify'

// export default function useGetChats() {
//     const [loading, setLoading] = useState(false);
//     const [chats, setChats] = useState([]);

//     useEffect(() => {
//         const getChats = async () => {
//             setLoading(true);
//             try {
//                 const response = await userService.getUsers();
//                 const data = response.data.followedUsers;
//                 // console.log('users data:', data)
//                 if (data.error) {
//                     throw new Error(data.error);
//                 }
//                 setChats(data);
//             } catch (error) {
//                 toast.error(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         getChats();
//     }, []);

//     return { loading, chats }
// }

import { useState, useEffect } from 'react';
import userService from '../../../services/user';
import { toast } from 'react-toastify';

export default function useGetChats() {
    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const getChats = async () => {
            setLoading(true);
            try {
                const response = await userService.getUsers();
                const data = response.data.participants; 
                
                if (data.error) {
                    throw new Error(data.error);
                }
                setChats(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        getChats();
    }, []);

    return { loading, chats, setChats };
}
