import React, { createContext, useState, useContext } from 'react';

const PostContext = createContext();

export const PostProvider = ({children}) => {
    const [post, setPost] = useState([]);
    const [updatePost, setUpdatePost] = useState(0);

    const addPost = (newPost) => {
        setPost((prevPost)=> [...prevPost, newPost]);
        setUpdatePost((prev)=> + 1)
    };

    return (
        <PostContext.Provider value={{addPost, post, updatePost}}>
            {children}
        </PostContext.Provider>
    )
};

export const usePostContext = () => {
    return useContext(PostContext);
}