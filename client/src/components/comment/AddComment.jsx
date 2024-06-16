import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCommentContext } from '../../context/comment';
import commentService from '../../services/comment';
import {
    Box,
    Grid,
    TextField,
    Button,
} from '@mui/material';

export default function AddComment() {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);

    const { postId } = useParams();
    const { addComment } =  useCommentContext();

    const handleContent = (e) => {
        setContent(e.target.value);
        setErrorMessage(undefined);
        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestBody = { content };
        setIsLoading(true);

        try {
            const response = await commentService.addComment(requestBody, postId);
            setContent("");
            setErrorMessage(undefined);
            addComment(response.data.comment)
            console.log('response add comment:', response);
        } catch (error) {
            const errorDescription = error.response.data.message;
            setErrorMessage(errorDescription);
            setIsLoading(false);
            console.log(errorDescription);
        }
        setIsLoading(false);
    }

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

