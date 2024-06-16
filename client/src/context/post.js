import React, { createContext, useState, useContext } from 'react';

const PostContext = createContext();

export const PostProvider = ({children}) => {
    const [post, setPost] = useState([]);
    const [updatePost, setUpdatePost] = useState(0);

    const addPost = (newPost) => {
        setPost((prevPost) => [...prevPost, newPost]);
        setUpdatePost((prev) => prev + 1);
    };

    const updatePostState = (postId, updatedPost) => {
        setPost((prevPost) => prevPost.map((post) => (post._id === postId ? updatedPost : post)));
        setUpdatePost((prev) => prev + 1);
    };

    return (
        <PostContext.Provider value={{ addPost, updatePostState, post, updatePost }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => {
    return useContext(PostContext);
};
