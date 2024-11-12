import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProfileActions } from './Actions';
import {
    Box,
    ImageList,
    ImageListItem,
    ListSubheader,
    Skeleton,
    ImageListItemBar,
    IconButton,
    Typography
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    ChatBubble as ChatBubbleIcon
} from '@mui/icons-material';

export default function UserCard() {
    const { userData, isLoading } = useUserProfileActions();

    return (
        <>
            <ImageList sx={{ width: '80%', margin: 'auto', marginBottom: 4 }}>
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
                    userData && userData.userPost.map((post) => (
                        <Link to={`/post/${post._id}`}>
                            <ImageListItem key={post._id}>
                                <img
                                    srcSet={`${post.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${post.image}?w=248&fit=crop&auto=format`}
                                    alt="post saved"
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    sx={{ height: 'auto', width: 'auto' }}
                                    title={
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '100%'
                                            }}
                                        >
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                aria-label=''
                                            >
                                                <FavoriteIcon />
                                            </IconButton>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                component="p"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    margin: '0 8px'
                                                }}
                                            >
                                                {post.likes}
                                            </Typography>
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                aria-label=''
                                            >
                                                <ChatBubbleIcon />
                                            </IconButton>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                component="p"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    margin: '0 8px',
                                                    marginRight: 1
                                                }}
                                            >
                                                {post.comments.length}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ImageListItem>
                        </Link>
                    ))
                )}
            </ImageList>
        </>
    );
}
