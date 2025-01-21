import React from 'react';
import { useAddCommentAction } from './Actions';
import {
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
        <form
            onSubmit={handleSubmit}
            autoComplete="off"
            style={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12}>
                <TextField
                    onChange={handleContent}
                    name="content"
                    placeholder="Add comment here..."
                    variant="outlined"
                    fullWidth
                    value={content}
                    InputProps={{ style: { color: 'white', borderColor: 'white' } }}
                    sx={{ input: { bgcolor: 'black', border: 'none' } }}
                />
            </Grid>
            <Button
                variant="text"
                color="primary"
                type="submit"
                disabled={isLoading || !content.trim()}
                sx={{ marginLeft: 2 }}>
                {isLoading ? 'Sending...' : 'Send'}
            </Button>
        </form>
    );
}