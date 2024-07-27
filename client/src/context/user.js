import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});
    const [updateUserInfo, setUpdateUserInfo] = useState(0);
    
        const updateInfo = (newInfo) => {
            setUserInfo((prevInfo) => ({
                ...prevInfo,
                ...newInfo,
            }));
            setUpdateUserInfo((prev) => prev + 1);
        };

        return (
            <UserContext.Provider value={{ userInfo, updateUserInfo, updateInfo }}>
                {children}
            </UserContext.Provider>
        );
    };

    export const useUserContext = () => {
        return useContext(UserContext);
    };