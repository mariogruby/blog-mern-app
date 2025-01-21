import React, { useState } from 'react';
import { useEditUserActions } from './Actions';
import { useUserProfileActions } from '../userProfile/Actions';
import {
    Container,
    Box,
    Grid,
    TextField,
    Button,
    Avatar,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import EditorImage from './ImageEditor';

export default function EditUser({ initialData, handleModalClose }) {
    const {
        name,
        lastName,
        isLoading,
        selectedImage,
        setSelectedImage,
        handleChange,
        handleSubmit
    } = useEditUserActions(initialData, handleModalClose);

    const { userData } = useUserProfileActions();
    const [isEditorOpen, setEditorOpen] = useState(false);
    const [imageToEdit, setImageToEdit] = useState(null);
    const theme = useTheme();

    const handleAvatarClick = () => {
        document.getElementById('image-upload-input').click();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageToEdit(file);
            setEditorOpen(true);
        }
    };

    const handleImageSave = (editedImage) => {
        setSelectedImage(editedImage);
        setEditorOpen(false);
    };

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
                        <Box display="flex" justifyContent="center" position="relative">
                            <Badge
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                badgeContent={
                                    <Box
                                        sx={{
                                            backgroundColor: '#3165f5',
                                            borderRadius: '50%',
                                            width: 32,
                                            height: 32,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                                        }}
                                    >
                                        <AddIcon
                                            color="white"
                                            fontSize="small"
                                            onClick={handleAvatarClick}
                                            sx={{
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Box>
                                }
                            >
                                <Avatar
                                    src={
                                        selectedImage
                                            ? URL.createObjectURL(selectedImage)
                                            : userData?.userImage
                                    }
                                    alt={userData?.username || 'User avatar'}
                                    sx={{
                                        width: { xs: 100, xl: 120 },
                                        height: { xs: 100, xl: 120 },
                                        marginTop: 2,
                                        marginBottom: 2,
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                                    }}
                                    onClick={handleAvatarClick}
                                />
                            </Badge>
                            <VisuallyHiddenInput
                                id="image-upload-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isLoading}
                            />
                        </Box>
                        <Grid item xs={12}>
                            <Button
                                startIcon={<DeleteIcon />}
                                variant="outlined"
                                color="error"
                                fullWidth
                                onClick={() => handleSubmit(null, true)}
                                disabled={isLoading}
                                sx={{
                                    display: userData?.userImage === 'https://res.cloudinary.com/dayo1mpv0/image/upload/v1683686792/default/profile.jpg'
                                        ? 'none'
                                        : 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {isLoading ? '...' : 'Remove Profile Picture'}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            onChange={handleChange}
                            name="name"
                            label="Your name here..."
                            variant="filled"
                            fullWidth
                            value={name}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            onChange={handleChange}
                            name="lastName"
                            label="Your last name here..."
                            variant="filled"
                            fullWidth
                            value={lastName}
                            disabled={isLoading}
                        />
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
            <Dialog open={isEditorOpen} onClose={() => setEditorOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Image</DialogTitle>
                <DialogContent>
                    <EditorImage image={imageToEdit} onSave={handleImageSave} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditorOpen(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}