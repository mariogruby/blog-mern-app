import React from 'react';
import { usePostContext } from '../../../context/post';
import { useAddPostActions } from './Actions';
import BtnOutlined from '../../../components/buttons/BtnOutlined';
import {
    Container,
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    Autocomplete,
    Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function AddPost({ handleModalClose }) {
    const { addPost } = usePostContext();
    const {
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
    } = useAddPostActions(addPost, handleModalClose);

    const VisuallyHiddenInput = styled('input')({
        display: 'none',
    });

    return (
        <Container component="main" >
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
                            <Box mt={2} align="center" sx={{ overflow: 'hidden', width: '100%', maxWidth: '300px', margin: '0 auto' }}>
                                <Typography variant="subtitle1">Image Preview:</Typography>
                                <img src={preview} alt="error" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '5px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)' }} />
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
