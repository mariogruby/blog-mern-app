import React from 'react';
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Box,
    Grid,
    Chip,
    TextField,
    Autocomplete,
    Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditorImage from './EditorImage';
import BtnOutlined from '../../buttons/BtnOutlined';
import { usePostContext } from '../../../context/post';
import { useAddPostActions } from './Actions';

const steps = ['Select an Image', 'Add text to your Post', 'Review'];

//TODO: pending successMessage and errorMessage utilization

function PostStepper({ handleModalClose }) {
    const { addPost } = usePostContext();
    const {
        tags,
        inputValue,
        isLoading,
        // successMessage,
        // errorMessage,
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
    } = useAddPostActions(addPost, handleModalClose);

    const VisuallyHiddenInput = styled('input')({
        display: 'none',
    });

    const handleSaveEditedImage = (editedImage) => {
        setSelectedImage(editedImage);
        handleNext();
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <label htmlFor="image-upload">
                            <VisuallyHiddenInput
                                id="image-upload"
                                type="file"
                                name="image-upload"
                                accept="image/*"
                                onChange={handleChange} />
                            <BtnOutlined
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                fullWidth
                            >
                                Upload Image
                            </BtnOutlined>
                        </label>
                        {selectedImage && (
                            <Box mt={2}>
                                <EditorImage
                                    image={selectedImage}
                                    onSave={handleSaveEditedImage}
                                />
                            </Box>
                        )}
                    </Box>
                );
            case 1:
                return (
                    <Container component="main" maxWidth="xs">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Add text here..."
                                    name="postText"
                                    multiline
                                    rows={4}
                                    variant="filled"
                                    fullWidth
                                    value={postText}
                                    onChange={handleChange}
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
                        </Grid>
                    </Container>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h6">Review</Typography>
                        {selectedImage && (
                            <Box mt={2}>
                                <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: '100%' }} />
                            </Box>
                        )}
                        <Box mt={2}>
                            <Typography variant="body1">{postText}</Typography>
                        </Box>
                        <Box mt={2}>
                            {tags.map((tag, index) => (
                                <Chip key={index} label={tag} />
                            ))}
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box>
                <Typography sx={{ mt: 2, mb: 1 }}>{renderStepContent(activeStep)}</Typography>
                {activeStep > 0 && activeStep < steps.length - 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext}>
                            Next
                        </Button>
                    </Box>
                )}
                {activeStep === steps.length - 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button
                            disabled={isLoading}
                            onClick={handleSubmit}
                        >
                            {isLoading ? 'Posting...' : 'Post'}
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default PostStepper;
