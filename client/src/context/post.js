import React, { createContext, useState, useContext } from 'react';

const PostContext = createContext();

export const PostProvider = ({children}) => {
    const [posts, setPosts] = useState([]);
    const [updatePost, setUpdatePost] = useState(0);

    const addPost = (newPost) => {
        setPosts((prevPosts) => [...prevPosts, newPost]);
        setUpdatePost((prev) => prev + 1);
    };

    const updatePostState = (postId, updatedPost) => {
        setPosts((prevPosts) => prevPosts.map((post) => post._id === postId ? updatedPost : post));
        setUpdatePost((prev) => prev + 1);
    };

    return (
        <PostContext.Provider value={{ addPost, updatePostState, posts, updatePost }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => {
    return useContext(PostContext);
};
