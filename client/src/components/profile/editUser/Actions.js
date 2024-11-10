import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/auth';
import userService from '../../../services/user';
import { useUserContext } from '../../../context/user'

//TODO: falta arreglar el reenderizado cuando se actualiza la informacion de user, está un poco disparejo 

export const useEditUserActions = (initialData, handleModalClose) => {
    const [name, setName] = useState(initialData.name || '');
    const [lastName, setLastName] = useState(initialData.lastName || '');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('lastName', lastName);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        try {
            const response = await userService.editUser(formData);
            const updatedData = response.data;
            updateInfo(updatedData);
            setErrorMessage(null);
            setSelectedImage(null);
            setTimeout(() => {
                setSuccessMessage('User information saved successfully');
            }, 1000)
            setTimeout(() => {
                setIsLoading(false);
                handleModalClose();
                // updateInfo();
            }, 1500);
            console.log('response edit user:', response);
        } catch (error) {
            const errorDescription = error.response?.data?.message || "Error occurred";
            setErrorMessage(errorDescription);
            setIsLoading(false);
            console.log(errorDescription);
        }
    };

    return {
        name,
        lastName,
        isLoading,
        successMessage,
        errorMessage,
        selectedImage,
        setSelectedImage,
        handleChange,
        handleSubmit
    };
};