import { useState } from 'react';
import postService from '../../../services/post';

export const useAddPostActions = (addPost, handleModalClose) => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [postText, setPostText] = useState("");

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    switch (name) {
      case 'postText':
        setPostText(value);
        break;
      case 'image-upload':
        const file = files[0];
        if (file) {
          setSelectedImage(URL.createObjectURL(file)); 
        }
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
    formData.append('content', postText);
    formData.append('tags', JSON.stringify(tags));
    if (selectedImage) {
      formData.append('image', selectedImage); 
    }

    try {
      const response = await postService.addPost(formData);
      setSuccessMessage('Add Post Successfully');
      setErrorMessage(null);
      setPostText('');
      setTags([]);
      setSelectedImage(null);
      addPost(response.data); 
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
    tags,
    inputValue,
    isLoading,
    successMessage,
    errorMessage,
    handleChange,
    handleTagsChange,
    handleInputChange,
    handleKeyDown,
    handleSubmit,
    activeStep,
    selectedImage,
    setSelectedImage,
    postText,
    handleNext,
    handleBack
  };
};
