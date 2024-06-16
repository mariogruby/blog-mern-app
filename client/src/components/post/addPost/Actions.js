import { useState } from 'react';
import postService from '../../../services/post';

export const useAddPostActions = (addPost, handleModalClose) => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        switch (name) {
            case 'content':
                setContent(value);
                break;
            case 'image':
                const file = files[0];
                setImage(file);
                setPreview(URL.createObjectURL(file));
                break;
            default:
                break;
        }
    };

    const handleTagsChange = (event, newValue) => {
        setTags(newValue);
    };

    const handleInputChange = (event, newValue) => {
        setInputValue(newValue);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags((prevTags) => [...prevTags, newTag]);
                setInputValue('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('content', content);
        formData.append('tags', JSON.stringify(tags));
        formData.append('image', image);

        try {
            const response = await postService.addPost(formData);
            setSuccessMessage('Add Post Successfully');
            setErrorMessage(null);
            setContent('');
            setTags([]);
            setImage(null);
            setPreview(null);
            addPost(formData);
            console.log('response add post:', response);
        } catch (error) {
            const errorDescription = error.response?.data?.message || "Error occurred";
            setErrorMessage(errorDescription);
            console.log(errorDescription);
        } finally {
            setIsLoading(false);
            handleModalClose();
        }
    };

    return {
        content,
        image,
        preview,
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
