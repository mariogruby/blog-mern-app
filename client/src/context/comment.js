import React, { createContext, useState, useContext } from 'react';

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
    const [comment, setComment] = useState([]);
    const [updateComment, setUpdateComment] = useState(0);

    const addComment = (newComment) => {
        setComment((prevComment) => [...prevComment, newComment]);
        setUpdateComment((prev) => prev + 1)
    };

    return (
        <CommentContext.Provider value={{ addComment, comment, updateComment }}>
            {children}
        </CommentContext.Provider>
    )
};

export const useCommentContext = () => {
    return useContext(CommentContext);
}