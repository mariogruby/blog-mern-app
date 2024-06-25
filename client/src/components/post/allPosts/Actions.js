import { useState, useEffect } from 'react';
import { usePostContext } from '../../../context/post';
import postService from '../../../services/post';
import userService from '../../../services/user';

export const useAllPostActions = () => {
    const { updatePost } = usePostContext();
    const [posts, setPosts] = useState([]);
    const [expandedIds, setExpandedIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [likedPosts, setLikedPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);

    const fetchData = async () => {
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
    }

    const fetchLikedPosts = async () => {
        try {
            const response = await userService.userLikedPost();
            if (response.data.success) {
                const likedPostIds = response.data.likedPost.map(post => post.Post._id);
                setLikedPosts(likedPostIds);
            }
        } catch (error) {
            console.error('Error getting liked posts', error);
        }
    }

    const handleToggleLike = async (postId) => {
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
    }

    const fetchSavedPosts = async () => {
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
    }

    const handleToggleSave = async (postId) => {
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

    const toggleExpand = (postId) => {
        if (expandedIds.includes(postId)) {
            setExpandedIds(expandedIds.filter(id => id !== postId));
        } else {
            setExpandedIds([...expandedIds, postId]);
        }
    };

    const isExpanded = (postId) => {
        return expandedIds.includes(postId);
    };

    useEffect(() => {
        fetchData();
    }, [updatePost]);

    useEffect(() => {
        fetchLikedPosts();
    }, []);

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    return {
        fetchData,
        fetchLikedPosts,
        handleToggleLike,
        fetchSavedPosts,
        handleToggleSave,
        toggleExpand,
        isExpanded,
        posts,
        isLoading,
        errorMessage,
        successMessage,
        likedPosts,
        savedPosts
    };
};
