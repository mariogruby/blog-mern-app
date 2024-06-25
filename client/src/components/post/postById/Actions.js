import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCommentContext } from '../../../context/comment';
import postService from '../../../services/post';
import commentService from '../../../services/comment';
import userService from '../../../services/user';

export const usePostByIdActions = () => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [likedPost, setLikedPost] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleComments, setVisibleComments] = useState(5);
    const [showMessage, setShowMessage] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedIds, setExpandedIds] = useState([]);
    const { postId } = useParams();
    const { updateComment } = useCommentContext();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await postService.getPostById(postId);
            setPost(response.data.post);
        } catch (error) {
            setErrorMessage("Error getting posts");
            console.error(error);
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const fetchComments = async () => {
        try {
            const response = await commentService.getCommentsPost(postId);
            const fetchedComments = response.data.comments.reverse();
            setComments(fetchedComments);
            if (response.data.comments.length > visibleComments) {
                setShowMessage(true);
            }
        } catch (error) {
            setErrorMessage("Error getting post comments");
            console.error("Error getting comments", error);
        }
    };

    const fetchLikedPosts = async () => {
        try {
            const response = await userService.userLikedPost();
            if (response.data.success) {
                const likedPostIds = response.data.likedPost.map(post => post.Post._id);
                setLikedPost(likedPostIds);
            }
        } catch (error) {
            console.error('Error getting liked posts', error);
        }
    };

    const handleToggleLike = async () => {
        try {
            const response = await postService.likePost(postId);
            if (response.data.success) {
                setPost(prevPost => ({
                    ...prevPost,
                    likes: response.data.post.likes,
                    liked: !prevPost.liked
                }));
                setLikedPost(prevLikedPost =>
                    prevLikedPost.includes(postId)
                        ? prevLikedPost.filter(id => id !== postId)
                        : [...prevLikedPost, postId]
                );
            }
        } catch (error) {
            console.error('Error toggling like', error);
        }
    };

    const loadMoreComments = () => {
        setVisibleComments(prevVisibleComments => prevVisibleComments + 5);
        setShowMessage(false);
    };

    const toggleExpand = async () => {
        if (expandedIds.includes(postId)) {
            setExpandedIds(expandedIds.filter(id => id !== postId));
        } else {
            setExpandedIds([...expandedIds, postId]);
        }
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setIsModalOpen(true);
        handleMenuClose();
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const isExpanded = () => {
        return expandedIds.includes(postId);
    };

    useEffect(() => {
        fetchData();
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [postId, updateComment, visibleComments]);

    useEffect(() => {
        fetchLikedPosts();
    }, []);

    return {
        handleToggleLike,
        loadMoreComments,
        toggleExpand,
        handleMenu,
        handleMenuClose,
        handleEdit,
        handleModalClose,
        isExpanded,
        post,
        comments,
        errorMessage,
        likedPost,
        isLoading,
        showMessage,
        anchorEl,
        isModalOpen,
        visibleComments,
        postId
    };
};