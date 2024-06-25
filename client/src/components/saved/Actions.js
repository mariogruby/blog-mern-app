import { useState, useEffect } from 'react';
import userService from '../../services/user'

export const useSavedActions = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await userService.userSavedPost();
            if (response.data.success) {
                if (Array.isArray(response.data.savedPosts)) {
                    const userSavedPosts = response.data.savedPosts.reverse();
                    setSavedPosts(userSavedPosts);
                } else {
                    console.error("savedPosts is not an array:", response.data.savedPosts);
                }
            } else {
                setErrorMessage("Failed to fetch saved posts");
                console.error("Server returned an error in response.data:", response.data);
            }
        } catch (error) {
            console.error("Server returned an error:", error);
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchData()
    }, []);

    return { 
        savedPosts,
        isLoading,
        errorMessage
    };
};