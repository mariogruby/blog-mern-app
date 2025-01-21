import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/auth';
import { toast } from 'react-toastify'
import { usePostContext } from '../../../context/post';
import postService from '../../../services/post';
import userService from '../../../services/user';
import useChat from '../../zustand/useChat';

export const useAllPostActions = () => {
    const { setSelectedChat } = useChat();
    const { isLoggedIn } = useContext(AuthContext);
    const { updatePost } = usePostContext();
    const [posts, setPosts] = useState([]);
    const [expandedIds, setExpandedIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [likedPosts, setLikedPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openModalList, setOpenModalList] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const fetchData = async (newPage = 1) => {
        if (newPage === 1) {
            setIsLoading(true);
        } else {
            setIsLoadingMorePosts(true);
        }
        try {
            const response = await postService.getAllPosts(newPage);
            if (response.data.success && Array.isArray(response.data.allPosts)) {
                const fetchedPosts = response.data.allPosts;
                if (newPage === 1) {
                    setPosts(fetchedPosts);
                } else {
                    setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
                }
                setTotalPages(response.data.totalPages);
                setPage(response.data.currentPage);
                setSuccessMessage("Posts fetched successfully");
            } else {
                toast.error("Failed to fetch posts");
                setErrorMessage("Failed to fetch posts");
            }
        } catch (error) {
            toast.error("Error getting post", error)
            setErrorMessage("Error getting posts, server is not responding, please try again");
            console.error('Error getting Posts', error);
        }
        setTimeout(() => {
            if (newPage === 1) {
                setIsLoading(false);
            } else {
                setIsLoadingMorePosts(false);
            }
        }, 1000);
    }

    const fetchLikedPosts = async () => {
        if (!isLoggedIn) return;
        try {
            const response = await userService.userLikedPost();
            if (response.data.success) {
                const likedPostIds = response.data.likedPost
                    .filter(post => post && post.Post && post.Post._id)
                    .map(post => post.Post._id);
                setLikedPosts(likedPostIds);
            }
        } catch (error) {
            toast.error('Error getting liked post', error);
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
            console.error('Error toggling like', error)
            toast.error('Error to toggling like', error.message)
        }
    }

    const fetchSavedPosts = async () => {
        if (!isLoggedIn) return;
        try {
            const response = await userService.userSavedPost();
            if (response.data.success) {
                const savedPosts = response.data.savedPosts || []; 
                if (savedPosts.length > 0) {
                    const savedPostIds = savedPosts
                        .filter(post => post && post._id) 
                        .map(post => post._id);
                    setSavedPosts(savedPostIds);
                }
            } else {
                toast.error("Server returned an error in response data in fetch saved post");
                console.error("Server returned an error:", response.data);
            }
        } catch (error) {
            toast.error("Error fetching saved posts");
            console.error("Error fetching saved posts", error);
        }
    };


    const handleToggleSave = async (postId) => {
        try {
            const response = await postService.savePost(postId)
            if (response.data.success) {
                setSavedPosts(prevSavedPosts => {
                    const isSaved = prevSavedPosts.includes(postId);
                    const updatedSavedPosts = isSaved
                        ? prevSavedPosts.filter(id => id !== postId)
                        : [...prevSavedPosts, postId];
                    if (isSaved) {
                        toast.info('UNSAVED POST');
                    } else {
                        toast.success('SAVED POST');
                    }
                    return updatedSavedPosts;
                });
            }
        } catch (error) {
            console.error('Error toggling save', error);
            toast.error(error.message);
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
    const handleLoadMore = () => {
        fetchData(page + 1);
    };

    const handleOpenChatList = (postId) => {
        setSelectedPostId(postId);
        setOpenModalList(true);
    };

    const handleCloseChatList = () => {
        setSelectedPostId(null);
        setOpenModalList(false);
        setSelectedChat(null);
    };

    useEffect(() => {
        fetchData();
    }, [updatePost]);

    useEffect(() => {
        fetchLikedPosts();
    }, [isLoggedIn]);

    useEffect(() => {
        fetchSavedPosts();
    }, [isLoggedIn]);

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
        isLoadingMorePosts,
        errorMessage,
        successMessage,
        likedPosts,
        savedPosts,
        page,
        totalPages,
        setPage,
        handleLoadMore,
        handleOpenChatList,
        handleCloseChatList,
        openModalList,
        selectedPostId
    };
};
