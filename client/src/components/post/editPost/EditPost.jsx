import React from 'react';
import { usePostContext } from '../../../context/post';
import { useEditPostActions } from './Actions';
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

export default function EditPost({ postId, initialData, handleModalClose }) {
    const {
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
    } = useEditPostActions(postId, initialData, handleModalClose);

    const VisuallyHiddenInput = styled('input')({
        display: 'none',
    });

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
                            label="Edit text here..."
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
                                    label="Edit tags and press Enter or Space"
                                    onKeyDown={handleKeyDown}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {/* {successMessage && <Typography color="success.main">{successMessage}</Typography>} */}
                        {errorMessage && <Typography color="error.main">{errorMessage}</Typography>}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
