import React, { useEffect, useState } from 'react'
import { usePostContext } from '../../context/post';
import postService from '../../services/post'
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import {
    Box,
    Grid,
    Paper,
    Card,
    CardHeader,
    CardContent,
    CardMedia,
    Avatar,
    Typography,
    IconButton,
    Skeleton,
    CardActions
} from '@mui/material'

export default function AllPosts() {
    const { updatePost } = usePostContext();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await postService.getAllPosts();
                console.log("Full Response:", response);
                if (response.data.success && Array.isArray(response.data.allPosts)) {
                    console.log("posts:", response.data.allPosts);
                    setPosts(response.data.allPosts);
                    setSuccessMessage("Posts fetched successfully");
                } else {
                    setErrorMessage("Failed to fetch posts");
                }
            } catch (error) {
                setErrorMessage("Error getting posts");
                console.error('Error getting Posts', error);
            }
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
        };

        fetchData();
    }, [updatePost]);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} columns={2}>
                {isLoading ? (
                    Array.from(new Array(6)).map((_, index) => (
                        <Grid item xs={8} key={index}>
                            <Card sx={{ maxWidth: 545, m: 2 }}>
                                <CardHeader
                                    avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
                                    action={null}
                                    title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
                                    subheader={<Skeleton animation="wave" height={10} width="40%" />}
                                />
                                <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
                                <CardContent>
                                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                                    <Skeleton animation="wave" height={10} width="80%" />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    posts.length > 0 ? (
                        posts.map((post) => (
                            <Grid item xs={8} key={post._id}>
                                <Card sx={{ maxWidth: 545, m: 2 }}>
                                    <CardHeader
                                        avatar={<Avatar alt={post.author.username} src={post.author.userImage} />}
                                        action={
                                            <IconButton aria-label="settings">
                                                <MoreVertIcon />
                                            </IconButton>
                                        }
                                        title={post.author.username}
                                        subheader={post.date}
                                    />
                                    <CardMedia
                                        component="img"
                                        image={post.image}
                                        alt='image'
                                        style={{ maxWidth: '100%', height: '90%' }}
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary" component="p">
                                            {post.content}
                                        </Typography>
                                    </CardContent>
                                    <CardActions disableSpacing>
                                        <IconButton aria-label="add to favorites">
                                            <FavoriteIcon />
                                        </IconButton>
                                        <IconButton aria-label="share">
                                            <ShareIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary" component="p">
                            No posts available.
                        </Typography>
                    )
                )}
                {errorMessage && (
                    <Typography variant="body2" color="error" component="p">
                        {errorMessage}
                    </Typography>
                )}
                {/* {successMessage && (
                    <Typography variant="body2" color="success" component="p">
                        {successMessage}
                    </Typography>
                )} */}
            </Grid>
        </Box>
    )
}
