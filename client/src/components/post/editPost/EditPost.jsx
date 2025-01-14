import React from 'react';
import { useEditPostActions } from './Actions';
import {
    Container,
    Box,
    Grid,
    TextField,
    Button,
    Autocomplete,
    Chip,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function EditPost({ postId, initialData, handleModalClose }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        content,
        tags,
        inputValue,
        isLoading,
        handleChange,
        handleTagsChange,
        handleInputChange,
        handleKeyDown,
        handleSubmit
    } = useEditPostActions(postId, initialData, handleModalClose);

    return (
        <Container component="main" maxWidth="md">
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    marginTop: isMobile ? 10 : 'auto'
                }}
            >
                <Grid container spacing={2} flex={1}>
                    <Grid item xs={12}>
                        <TextField
                            rows={4}
                            onChange={handleChange}
                            name="content"
                            multiline
                            label="Edit text here..."
                            variant="outlined"
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
                                value.map((option, index) => {
                                    const { key, ...tagProps } = getTagProps({ index });
                                    return <Chip key={key} label={option} {...tagProps} />;
                                })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Edit tags and press Enter or Space"
                                    onKeyDown={handleKeyDown}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
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
                        onClick={handleModalClose}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}