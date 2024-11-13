import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/auth';
import userService from '../../services/user'
import { toast } from 'react-toastify';

export const useSavedActions = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [savedPosts, setSavedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchData = async () => {
        if (!isLoggedIn) return;
        setIsLoading(true);
        try {
            const response = await userService.userSavedPost();
            if (response.data.success) {
                const savedPosts = response.data.savedPosts || [];
                if (savedPosts.length > 0) {
                    setSavedPosts(savedPosts.reverse());
                } else {
                    setSuccessMessage("There are no saved posts yet");
                }
            } else {
                toast.error("Error getting saved posts");
                setErrorMessage("Error getting saved posts");
            }
        } catch (error) {
            toast.error("Error in server");
            console.error("Error in server", error.message);
            setErrorMessage("Error in server");
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    };
    

    useEffect(() => {
        fetchData()
    }, [isLoggedIn]);

    return { 
        savedPosts,
        isLoading,
        errorMessage,
        successMessage
    };
};