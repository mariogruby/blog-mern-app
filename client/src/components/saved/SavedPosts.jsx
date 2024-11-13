import React from 'react';
import { useSavedActions } from './Actions';
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    ListSubheader,
    IconButton,
    Skeleton,
    Box,
    Typography,
} from '@mui/material';
import {
    Info as InfoIcon,
    Error as ErrorIcon
} from '@mui/icons-material';

//TODO: arreglar responsive 

export default function SavedPosts() {
    const { savedPosts, isLoading, successMessage, errorMessage } = useSavedActions();

    return (
        <>
            <ImageList sx={{ width: '80%' }}>
                <ImageListItem key="Subheader" cols={2}>
                    <ListSubheader component="div">All Posts</ListSubheader>
                </ImageListItem>
                {isLoading ? (
                    Array.from(new Array(8)).map((_, index) => (
                        <ImageListItem key={index}>
                            <Skeleton variant="rectangular" width={248} height={248} animation="wave" />
                            <Box sx={{ pt: 0.5 }}>
                                <Skeleton width="80%" animation="wave" />
                                <Skeleton width="60%" animation="wave" />
                            </Box>
                        </ImageListItem>
                    ))
                ) : (
                    savedPosts.map((post) => (
                        <ImageListItem key={post._id}>
                            <img
                                srcSet={`${post.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${post.image}?w=248&fit=crop&auto=format`}
                                alt="post saved"
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={post.author.username}
                                subtitle={`@${post.author.username}`}
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                        aria-label={`info about ${post.author.username}`}
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                    ))
                )}
            </ImageList>
            {successMessage && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                    fontSize: '18px'
                }}>
                    <Typography><ErrorIcon /> {successMessage}</Typography>
                </Box>
            )}
            {errorMessage && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                    fontSize: '18px'
                }}>
                    <Typography><ErrorIcon /> {errorMessage}</Typography>
                </Box>
            )}
        </>
    );
}
