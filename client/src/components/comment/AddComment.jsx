import React from 'react';
import { useAddCommentAction } from './Actions';
import {
    Box,
    Grid,
    TextField,
    Button,
} from '@mui/material';

export default function AddComment() {
    const {
        handleContent,
        handleSubmit,
        isLoading,
        // errorMessage,
        content
    } = useAddCommentAction();

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
        >
            <Grid item xs={12}>
                <TextField
                    rows={2}
                    onChange={handleContent}
                    name="content"
                    multiline
                    label="Add comment here..."
                    variant="filled"
                    fullWidth
                    value={content}
                />
            </Grid>
            {content.trim() && (
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </Button>
                </Box>
            )}
        </Box>
    );
}

