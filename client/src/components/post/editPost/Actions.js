import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { usePostContext } from '../../../context/post';
import postService from '../../../services/post';

export const useEditPostActions = (postId, initialData, handleModalClose) => {
    const [content, setContent] = useState(initialData.content || '');
    const [tags, setTags] = useState(initialData.tags || []);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { updatePostState } = usePostContext();

    useEffect(() => {
        setContent(initialData.content || '');
        setTags(initialData.tags || []);
    }, [initialData]);

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    const handleTagsChange = (event, newValue) => {
        setTags(newValue);
    };

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            setTags([...tags, inputValue]);
            setInputValue('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await postService.editPost(postId, { content, tags });
            if ( response.data.success) {
                toast.success('Post edited successfully')
                setTimeout(() => {
                    handleModalClose();
                    updatePostState(postId, response.data.post);
                    setIsLoading(false);
                }, 1000);
            }
        } catch (error) {
            toast.error('Error editing post');
            setIsLoading(false);
        }
    };

    return {
        content,
        tags,
        inputValue,
        isLoading,
        handleChange,
        handleTagsChange,
        handleInputChange,
        handleKeyDown,
        handleSubmit
    };
};
