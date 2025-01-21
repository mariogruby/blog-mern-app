import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCommentContext } from '../../context/comment';
import commentService from '../../services/comment';

export const useAddCommentAction = () => {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const { postId } = useParams();
    const { addComment } = useCommentContext();

    const handleContent = (e) => {
        setContent(e.target.value);
        setErrorMessage(undefined);
        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestBody = { content };
        setIsLoading(true);

        try {
            const response = await commentService.addComment(requestBody, postId);
            setContent("");
            setErrorMessage(undefined);
            addComment(response.data.comment)
            // console.log('response add comment:', response);
        } catch (error) {
            const errorDescription = error.response.data.message;
            setErrorMessage(errorDescription);
            setIsLoading(false);
            console.log(errorDescription);
        }
        setIsLoading(false);
    };

    return {
        handleContent,
        handleSubmit,
        isLoading,
        errorMessage,
        content
    };
};
