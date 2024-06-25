import { usePostContext } from '../../../context/post';
import postService from '../../../services/post';
import userService from '../../../services/user';

export const fetchData = async (setPosts, setIsLoading, setErrorMessage, setSuccessMessage) => {
    setIsLoading(true);
    try {
        const response = await postService.getAllPosts();
        if (response.data.success && Array.isArray(response.data.allPosts)) {
            const fetchedPosts = response.data.allPosts.reverse();
            setPosts(fetchedPosts);
            setSuccessMessage("Posts fetched successfully");
        } else {
            setErrorMessage("Failed to fetch posts");
        }
    } catch (error) {
        setErrorMessage("Error getting posts");
        console.error('Error getting Posts', error);
    }
    setTimeout(() => {
        setIsLoading(false)
    }, 1000);
};

export const fetchLikedPosts = async (setLikedPosts) => {
    try {
        const response = await userService.userLikedPost();
        if (response.data.success) {
            const likedPostIds = response.data.likedPost.map(post => post.Post._id);
            setLikedPosts(likedPostIds);
        }
    } catch (error) {
        console.error('Error getting liked posts', error);
    }
};

export const handleToggleLike = async (postId, setPosts, setLikedPosts) => {
    try {
        const response = await postService.likePost(postId);
        if (response.data.success) {
            setPosts(prevPosts => prevPosts.map(post =>
                post._id === postId ? { ...post, likes: response.data.post.likes, liked: !post.liked } : post
            ));
            setLikedPosts(prevLikedPosts =>
                prevLikedPosts.includes(postId)
                    ? prevLikedPosts.filter(id => id !== postId)
                    : [...prevLikedPosts, postId]
            );
        }
    } catch (error) {
        console.error('Error toggling like', error);
    }
};

export const fetchSavedPosts = async (setSavedPosts) => {
    try {
        const response = await userService.userSavedPost();
        if (response.data.success) {
            if (Array.isArray(response.data.savedPosts)) {
                const savedPostIds = response.data.savedPosts.map(post => post._id);
                setSavedPosts(savedPostIds);
            } else {
                console.error("savedPosts is not an array:", response.data.savedPosts);
            }
        } else {
            console.error("Server returned an error:", response.data);
        }
    } catch (error) {
        console.error("Error fetching saved posts", error);
    }
};

export const handleToggleSave = async (postId, setSavedPosts) => {
    try {
        const response = await postService.savePost(postId)
        if (response.data.success) {
            setSavedPosts(prevSavedPosts =>
                prevSavedPosts.includes(postId)
                    ? prevSavedPosts.filter(id => id !== postId)
                    : [...prevSavedPosts, postId]
            )
        }
    } catch (error) {
        console.error('Error toggling save', error);
    }
};