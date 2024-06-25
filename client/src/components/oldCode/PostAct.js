import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCommentContext } from '../../../context/comment';
import postService from '../../../services/post';
import commentService from '../../../services/comment';
import userService from '../../../services/user';

export const fetchData = async (postId, setPost, setErrorMessage, setIsLoading) => {
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

export const fetchComments = async (postId, setComments, setErrorMessage, setShowMessage, visibleComments) => {
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

export const fetchLikedPosts = async (setLikedPost) => {
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

export const handleToggleLike = async (postId, setPost, setLikedPost) => {
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

export const loadMoreComments = (setVisibleComments, setShowMessage) => {
    setVisibleComments(prevVisibleComments => prevVisibleComments + 5);
    setShowMessage(false);
};

export const toggleExpand = async (postId, expandedIds, setExpandedIds) => {
    if (expandedIds.includes(postId)) {
        setExpandedIds(expandedIds.filter(id => id !== postId));
    } else {
        setExpandedIds([...expandedIds, postId]);
    }
}
