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
    Container,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditorImage from './EditorImage';
import { usePostContext } from '../../../context/post';
import { useAddPostActions } from './Actions';



//TODO: pending successMessage and errorMessage utilization

function PostStepper({ handleModalClose }) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const steps = [isMobile ? 'Image' : 'Select an image', isMobile ? 'Content' : 'Add content and tags to your post', isMobile ? 'Review' : 'Review your post'];

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
                            <Box
                                display="flex"
                                justifyContent="center"
                            >
                                <Button
                                    size="large"
                                    variant="contained"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload image
                                </Button>
                            </Box>
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
                    <Grid container spacing={2} flex={1}>
                        <Grid item xs={12}>
                            <TextField
                                label="Add text here..."
                                name="postText"
                                multiline
                                rows={4}
                                variant="outlined"
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
                                    value.map((option, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return <Chip key={key} label={option} {...tagProps} />;
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Type tags and press Enter or Space"
                                        onKeyDown={handleKeyDown}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
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
        <Box
            sx={{ width: '100%' }}
        >
            <Stepper activeStep={activeStep} >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box>
                <Typography component="div" sx={{ mt: 2, mb: 1 }}>
                    {renderStepContent(activeStep)}
                </Typography>
                {activeStep > 0 && activeStep < steps.length - 1 && (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        pt: 2,
                        marginTop: isMobile ? 'auto' : 2,
                        position: isMobile ? 'fixed' : 'static',
                        bottom: isMobile ? 0 : 'auto',
                        left: 0,
                        width: '100%',
                        padding: isMobile ? 2 : 0,
                        boxShadow: isMobile ? '0 -2px 10px rgba(0,0,0,0.1)' : 'none',
                    }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button
                            variant="contained"
                            onClick={handleNext}>
                            Next
                        </Button>
                    </Box>
                )}
                {activeStep === steps.length - 1 && (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        pt: 2,
                        marginTop: isMobile ? 'auto' : 2,
                        position: isMobile ? 'fixed' : 'static',
                        bottom: isMobile ? 0 : 'auto',
                        left: 0,
                        width: '100%',
                        padding: isMobile ? 2 : 0,
                        boxShadow: isMobile ? '0 -2px 10px rgba(0,0,0,0.1)' : 'none',
                    }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button
                            variant="contained"
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
