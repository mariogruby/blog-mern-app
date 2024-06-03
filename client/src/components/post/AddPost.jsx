import React, { useState } from 'react';
import { usePostContext } from '../../context/post';
import postService from '../../services/post';
import ModalAddPost from './ModalAddPost';
import BtnOutlined from '../../components/buttons/BtnOutlined'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import {
    Container,
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    Autocomplete,
    Chip, 
    DemoPaper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function AddPost() {
    const { addPost } = usePostContext();
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const VisuallyHiddenInput = styled('input')({
        display: 'none',
    });

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
            const errorDescription = error.response.data.message;
            setErrorMessage(errorDescription);
            setIsLoading(false);
            console.log(errorDescription);
        }
        setIsLoading(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            rows={4}
                            onChange={handleChange}
                            name="content"
                            multiline
                            label="Add text here..."
                            variant="filled"
                            fullWidth
                            value={content}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={tags}
                            inputValue={inputValue}
                            onChange={handleTagsChange}
                            onInputChange={handleInputChange}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    label="Type tags and press Enter or Space"
                                    onKeyDown={handleKeyDown}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <label htmlFor="image-upload">
                            <VisuallyHiddenInput
                                accept="image/*"
                                id="image-upload"
                                type="file"
                                name="image"
                                onChange={handleChange}
                            />
                            <BtnOutlined
                                
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                fullWidth
                            >
                                Upload Image
                            </BtnOutlined>
                        </label>
                    </Grid>
                    <Grid item xs={12}>
                        {preview && (
                            <Box mt={2}>
                                <Typography variant="subtitle1">Image Preview:</Typography>
                                <img src={preview} alt="error" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)' }} />
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Posting...' : 'Post'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
