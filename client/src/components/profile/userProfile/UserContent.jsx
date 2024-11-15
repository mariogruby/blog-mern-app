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
    ChatBubble as ChatBubbleIcon,
    CameraAlt as CameraAltIcon
} from '@mui/icons-material';

export default function UserCard() {
    const { userData, isLoading, postSuccessMessage } = useUserProfileActions();

    return (
        <>
            <ImageList sx={{
                margin: { xs: 1, xl: 5 },
                marginLeft: { xs: 0, xl: 15 },
                width: { xs: '100%', xl: '80%' },
                position: 'relative',
                overflowX: 'hidden',
            }}>
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
                            <ImageListItem key={index}>
                                <Skeleton variant="rectangular" width={'100%'} height={248} animation="wave" />
                                <Box sx={{ pt: 0.5 }}>
                                    <Skeleton width="100%" animation="wave" />
                                    <Skeleton width="80%" animation="wave" />
                                </Box>
                            </ImageListItem>
                        </Box>
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
            {postSuccessMessage && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '40vh',
                    textAlign: 'center',
                    fontSize: '18px'
                }}>
                    <Typography><CameraAltIcon /> {postSuccessMessage}</Typography>
                </Box>
            )}
        </>
    );
}
