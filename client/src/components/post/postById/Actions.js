import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/auth';
import { usePostContext } from '../../../context/post';
import { useParams } from 'react-router-dom';
import { useCommentContext } from '../../../context/comment';
import postService from '../../../services/post';
import commentService from '../../../services/comment';
import userService from '../../../services/user';
import { toast } from 'react-toastify';

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
    const [savedPost, setSavedPost] = useState([]);
    const { user } = useContext(AuthContext);
    const { postId } = useParams();
    const { updateComment } = useCommentContext();
    const { updatePost } = usePostContext();
    const navigate = useNavigate();

    const isAuthor = user && post && user.username === post.author.username;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await postService.getPostById(postId);
            setPost(response.data.post);
        } catch (error) {
            toast.error("Error getting post")
            setErrorMessage("Error getting post");
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
            toast.error("Error getting post comments")
            setErrorMessage("Error getting post comments");
            console.error("Error getting comments", error);
        }
    };

    const fetchLikedPosts = async () => {
        try {
            const response = await userService.userLikedPost();
            if (response.data.success) {
                const likedPostIds = response.data.likedPost
                    .filter(post => post && post.Post && post.Post._id)
                    .map(post => post.Post._id);
                setLikedPost(likedPostIds);
            }
        } catch (error) {
            toast.error('Error getting liked posts', error);
        }
    }


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
            console.error('Error toggling like', error)
            toast.error('Error toggling like', error);
        }
    };

    const fetchSavedPosts = async () => {
        try {
            const response = await userService.userSavedPost();
            if (response.data.success) {
                if (Array.isArray(response.data.savedPosts)) {
                    const savedPostIds = response.data.savedPosts
                        .filter(post => post && post._id)
                        .map(post => post._id);
                    setSavedPost(savedPostIds);
                } else {
                    console.error("savedPosts is not an array:", response.data.savedPosts);
                }
            } else {
                toast.error("Server returned an error in response data in fetch saved post")
                console.error("Server returned an error:", response.data);
            }
        } catch (error) {
            toast.error("Error fetching saved posts", error);
            console.error("Error fetching saved posts", error);
        }
    }


    const handleToggleSave = async () => {
        try {
            const response = await postService.savePost(postId);
            if (response.data.success) {
                setSavedPost(prevSavedPost => {
                    const isSaved = prevSavedPost.includes(postId)
                    const updatedSavedPosts = isSaved
                        ? prevSavedPost.filter(id => id !== postId)
                        : [...prevSavedPost, postId]
                    if (isSaved) {
                        toast.info('UNSAVED POST');
                    } else {
                        toast.success('SAVED POST');
                    }
                    return updatedSavedPosts;
                });
            }
        } catch (error) {
            toast.error('Error toggling save', error.message);
            console.error('Error toggling save', error);
        }
    };

    const handleDeletePost = async () => {
        setIsLoading(true);
        try {
            const response = await postService.deletePost(postId);
            if (response.data.success) {
                toast.success('Post deleted successfully');
                navigate('/')
            }
        } catch (error) {
            toast.error('Error deleting post');
            console.error('Error delete post ', error)
        } finally {
            setIsLoading(false);
        }
    }

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
    }, [postId, updatePost]);

    useEffect(() => {
        fetchComments();
    }, [postId, updateComment, visibleComments]);

    useEffect(() => {
        fetchLikedPosts();
    }, []);

    useEffect(() => {
        fetchSavedPosts();
    }, []);


    return {
        isAuthor,
        handleToggleLike,
        loadMoreComments,
        toggleExpand,
        handleMenu,
        handleMenuClose,
        handleEdit,
        handleModalClose,
        isExpanded,
        handleToggleSave,
        handleDeletePost,
        post,
        comments,
        errorMessage,
        likedPost,
        isLoading,
        showMessage,
        anchorEl,
        isModalOpen,
        visibleComments,
        savedPost,
        postId
    };
};