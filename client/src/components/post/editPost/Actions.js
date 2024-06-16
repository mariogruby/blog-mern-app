import { useState, useEffect } from 'react';
import postService from '../../../services/post';
import { usePostContext } from '../../../context/post'; // Ajusta la ruta según tu estructura de archivos

export const useEditPostActions = (postId, initialData, handleModalClose) => {
    const { updatePostState } = usePostContext(); // Utiliza el contexto para actualizar el estado
    const [content, setContent] = useState(initialData.content || '');
    const [tags, setTags] = useState(initialData.tags || []);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
            const { data } = await postService.editPost(postId, { content, tags });
            updatePostState(postId, data.post); // Actualiza el estado del contexto
            setSuccessMessage('Post edited successfully');
        } catch (error) {
            setErrorMessage('Error editing post');
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                handleModalClose();
            }, 1000);
        }
    };

    return {
        content,
        tags,
        inputValue,
        isLoading,
        successMessage,
        errorMessage,
        handleChange,
        handleTagsChange,
        handleInputChange,
        handleKeyDown,
        handleSubmit
    };
};
