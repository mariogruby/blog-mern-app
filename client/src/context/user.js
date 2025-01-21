import React, { createContext, useState, useEffect, useContext } from 'react';
import userService from '../services/user.js'
import { AuthContext } from './auth.js';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({});
    const [updateUserInfo, setUpdateUserInfo] = useState(0);

    const username = user ? user.username : null;

    const fetchData = async () => {
        if(!username) return;
        try {
        const response = await userService.getUser(username);
        setUserInfo(response.data.userData)
        } catch (error) {
            console.error(error)
            setUserInfo(null);
        }
    }

    const updateInfo = (newInfo) => {
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            ...newInfo,
        }));
        setUpdateUserInfo((prev) => prev + 1);

        fetchData();
    };

    useEffect(()=> {
        fetchData()
    }, [user, updateUserInfo])

    return (
        <UserContext.Provider value={{ userInfo, updateUserInfo, updateInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};