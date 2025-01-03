import React from 'react';
import { Link } from 'react-router-dom'
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

export default function SavedPosts() {
    const { savedPosts, isLoading, successMessage, errorMessage } = useSavedActions();

    return (
        <>
            <ImageList
                sx={{
                    margin: { xs: 1, xl: 5 },
                    marginLeft: { xs: 0, xl: 15 },
                    width: { xs: '100%', xl: '80%' },
                    position: 'relative',
                    overflowX: 'hidden',
                    marginBottom: { xs: '56px', xl: 0 },
                }}
            >
                <ImageListItem key="Subheader" cols={2}>
                    <ListSubheader component="div">All Posts</ListSubheader>
                </ImageListItem>
                {isLoading ? (
                    Array.from(new Array(8)).map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: '100%',
                                margin: { xs: 0, sm: 3 },
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <ImageListItem>
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    sx={{
                                        width: { xs: '100%', sm: '90%', md: '70%', lg: '60%' },
                                        height: 200,
                                        margin: '0 auto',
                                    }}
                                />
                                <Box sx={{ pt: 0.5 }}>
                                    <Skeleton
                                        sx={{
                                            width: { xs: '100%', sm: '90%', md: '70%', lg: '60%' },
                                            margin: '0 auto',
                                        }}
                                        animation="wave" />
                                    <Skeleton
                                        sx={{
                                            width: { xs: '100%', sm: '90%', md: '70%', lg: '60%' },
                                            margin: '0 auto',
                                        }} animation="wave" />
                                </Box>
                            </ImageListItem>
                        </Box>
                    ))
                ) : (
                    savedPosts.map((post) => (
                        <ImageListItem
                            component={Link}
                            to={`/post/${post._id}`}
                            key={post._id}
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                srcSet={`${post.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${post.image}?w=248&fit=crop&auto=format`}
                                alt="post saved"
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    maxWidth: '600px',
                                    height: 'auto',
                                    objectFit: 'cover',
                                }}
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
                                sx={{
                                    width: '100%',
                                    maxWidth: '600px',
                                    margin: '0 auto',
                                }}
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
