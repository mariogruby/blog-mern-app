import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import userService from '../../../services/user';
import { useUserContext } from '../../../context/user'

export const useEditUserActions = (initialData, handleModalClose) => {
    const [name, setName] = useState(initialData.name || '');
    const [lastName, setLastName] = useState(initialData.lastName || '');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { updateInfo } = useUserContext();

    useEffect(() => {
        setName(initialData.name || '');
        setLastName(initialData.lastName || '');
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'image-upload':
                const file = files[0];
                if (file) {
                    setSelectedImage(file);
                }
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e, removeImage = false) => {
        if (e) e.preventDefault();
        setIsLoading(true);
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('lastName', lastName);
    
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        if (removeImage) {
            formData.append('removeImage', true);
        }
    
        try {
            const response = await userService.editUser(formData);
            const updatedData = response.data;
    
            if (response.data.success) {
                updateInfo(updatedData);
                setSelectedImage(null);
                toast.success('User information saved successfully');
                setIsLoading(false);
                handleModalClose();
            } else {
                toast.error('Error occurred while saving user information');
                setIsLoading(false);
            }
        } catch (error) {
            const errorDescription = error.response?.data?.message || "Error occurred";
            toast.error(errorDescription);
            setIsLoading(false);
        }
    };

    return {
        name,
        lastName,
        isLoading,
        selectedImage,
        setSelectedImage,
        handleChange,
        handleSubmit
    };
};