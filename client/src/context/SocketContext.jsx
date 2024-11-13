import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./auth";
import io from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            const socket = io("http://localhost:5005", {
                query: {
                    userId: user._id,
                },
                reconnection: true, 
                reconnectionAttempts: 5, 
                reconnectionDelay: 1000,
            });

            setSocket(socket);

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            return () => {
                socket.disconnect(); 
            };
        } else {
            if (socket) {
                socket.disconnect(); 
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
}
