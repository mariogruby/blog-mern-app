import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/auth';
import userService from '../../services/user'
import { toast } from 'react-toastify';

export const useSavedActions = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [savedPosts, setSavedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchData = async () => {
        if(!isLoggedIn) return;

        setIsLoading(true);
        try {
            const response = await userService.userSavedPost();
            if (response.data.success) {
                if (Array.isArray(response.data.savedPosts)) {
                    const userSavedPosts = response.data.savedPosts.reverse();
                    setSavedPosts(userSavedPosts);
                } else {
                    console.log("savedPosts is not an array:", response.data.savedPosts);
                }
            } else {
                toast.error("Failed to fetch saved posts")
                setErrorMessage("Failed to fetch saved posts");
                console.error("Server returned an error in response.data:", response.data);
            }
        } catch (error) {
            toast.error(error.message);
            console.error("Server returned an error:", error);
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchData()
    }, [isLoggedIn]);

    return { 
        savedPosts,
        isLoading,
        errorMessage
    };
};