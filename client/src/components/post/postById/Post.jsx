import React from 'react';
import { usePostByIdActions } from './Actions'
import AddComment from '../../comment/AddComment';
import ModalEditPost from '../../post/editPost/ModalEditPost';
import EditPost from '../../post/editPost/EditPost';
import { pink } from '@mui/material/colors';
import { format } from '@formkit/tempo';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Share as ShareIcon,
    MoreVert as MoreVertIcon,
    ModeCommentOutlined as ModeCommentOutlinedIcon,
} from '@mui/icons-material';
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    CardHeader,
    Avatar,
    Box,
    List,
    ListItemText,
    ListItem,
    ListItemAvatar,
    Skeleton,
    IconButton,
    Button,
    Menu,
    MenuItem
} from '@mui/material';

//TODO: errorMessage implementation and clean code
//TODO: re design add comment texArea,

export default function Post() {
    const {
        handleToggleLike,
        loadMoreComments,
        toggleExpand,
        handleMenu,
        handleMenuClose,
        handleEdit,
        handleModalClose,
        isExpanded,
        post,
        comments,
        // errorMessage,
        likedPost,
        isLoading,
        showMessage,
        anchorEl,
        isModalOpen,
        visibleComments,
        postId
    } = usePostByIdActions()

    const formatDate = (dateString) => {
        const l = "en";
        return format(new Date(dateString), "MMMM D, h:mm a", l);
    };

    return (
        <>
            {isLoading ? (
                <Card sx={{ width: '80%', minHeight: 300, display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
                    <Grid container sx={{ height: '100%' }}>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                            <Skeleton animation="wave" variant="rectangular" width="100%" height={300} />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 2 }}>
                                <Box sx={{ borderBottom: '1px solid #3f3f46' }}>
                                    <CardHeader
                                        avatar={
                                            <Skeleton animation="wave" variant="circular" width={40} height={40} />
                                        }
                                        action={
                                            <Skeleton animation="wave" variant="rectangular" width={24} height={24} />
                                        }
                                        title={<Skeleton animation="wave" variant="text" width="80%" />}
                                        subheader={<Skeleton animation="wave" variant="text" width="40%" />}
                                    />
                                </Box>
                                <Box sx={{ borderBottom: '1px solid #3f3f46' }}>
                                    <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 200 }}>
                                        {Array.from(new Array(3)).map((_, index) => (
                                            <ListItem alignItems="flex-start" key={index}>
                                                <ListItemAvatar>
                                                    <Skeleton animation="wave" variant="circular" width={40} height={40} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={<Skeleton animation="wave" variant="text" width="60%" />}
                                                    secondary={<Skeleton animation="wave" variant="text" width="80%" />}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                                <CardActions disableSpacing>
                                    <Skeleton animation="wave" variant="rectangular" width={24} height={24} />
                                    <Skeleton animation="wave" variant="rectangular" width={24} height={24} />
                                </CardActions>
                                <Skeleton animation="wave" variant="rectangular" width="100%" height={50} />
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            ) : (
                post ? (
                    <Card sx={{ width: '80%', minHeight: 300, display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
                        <Grid container sx={{ height: '100%' }}>
                            <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ height: 'auto', width: '100%', objectFit: 'cover' }}
                                    image={post.image}
                                    title="green iguana"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 2 }}>
                                    <Box sx={{ borderBottom: '1px solid #3f3f46' }}>
                                        <CardHeader
                                            avatar={<Avatar sx={{ width: 50, height: 50 }} alt={post.author.username} src={post.author.userImage} />}
                                            action={
                                                <>
                                                    <IconButton aria-label="settings" onClick={handleMenu}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        anchorEl={anchorEl}
                                                        open={Boolean(anchorEl)}
                                                        onClose={handleMenuClose}
                                                    >
                                                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                                        {/* Add more MenuItem components for other options if needed */}
                                                    </Menu>
                                                </>
                                            }
                                            title={post.author.username}
                                            subheader={formatDate(post.createdAt)}
                                        />
                                    </Box>
                                    <Box sx={{ borderBottom: '1px solid #3f3f46' }}>
                                        <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 200 }}>
                                            <Box sx={{ borderBottom: '1px solid #3f3f46' }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    component="p"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: isExpanded(post._id) ? 'unset' : 3,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {post.content}
                                                </Typography>
                                                {post.content.length > 200 && !isExpanded(post._id) && (
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <Button size="small" onClick={() => toggleExpand(post._id)} sx={{ mt: 1 }}>
                                                        Read more
                                                    </Button>
                                                </Box>
                                            )}
                                            </Box>
                                            {comments.length === 0 ? (
                                                <Typography>There are no comments yet, be the first to comment</Typography>
                                            ) : (
                                                comments.slice(0, visibleComments).map(comment => (
                                                    <ListItem alignItems="flex-start" key={comment._id}>
                                                        <ListItemAvatar>
                                                            <Avatar alt={comment.author.username} src={comment.author.userImage} />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                <React.Fragment>
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body1"
                                                                        sx={{ fontWeight: 'bold' }}>
                                                                        {comment.author.username}
                                                                    </Typography>
                                                                    {' - '}
                                                                    <Typography
                                                                        component="span"
                                                                        variant="subtitle2"
                                                                        color="text.secondary"
                                                                        sx={{ marginLeft: 1 }}>
                                                                        {formatDate(comment.createdAt)}
                                                                    </Typography>
                                                                </React.Fragment>
                                                            }
                                                            secondary={
                                                                <React.Fragment>
                                                                    <Typography
                                                                        sx={{ display: 'inline' }}
                                                                        component="span"
                                                                        variant="body2"
                                                                        color="text.primary">
                                                                        {comment.content}
                                                                    </Typography>
                                                                </React.Fragment>
                                                            }
                                                        />
                                                    </ListItem>
                                                )))}
                                            {showMessage && (
                                                <Box textAlign="center" mb={1}>
                                                    <Button onClick={loadMoreComments}>show more comments</Button>
                                                </Box>
                                            )}
                                        </List>
                                    </Box>
                                    <CardActions disableSpacing>
                                        <IconButton
                                            aria-label="add to favorites"
                                            onClick={() => handleToggleLike(post._id)}
                                        >
                                            {likedPost.includes(post._id) ? (
                                                <FavoriteIcon sx={{ color: pink[500] }} />
                                            ) : (
                                                <FavoriteBorderIcon />
                                            )}
                                        </IconButton>
                                        <Typography variant="body2" color="text.secondary" component="p">
                                            {post.likes}
                                        </Typography>
                                        <IconButton
                                            aria-label="add a comment">
                                            <ModeCommentOutlinedIcon />
                                        </IconButton>
                                        <IconButton aria-label="share">
                                            <ShareIcon />
                                        </IconButton>
                                    </CardActions>
                                    <AddComment />
                                </CardContent>
                            </Grid>
                        </Grid>
                    </Card>
                ) : (
                    <p>Post not found</p>
                )
            )}
            <ModalEditPost open={isModalOpen} handleClose={handleModalClose}>
                <EditPost postId={postId} initialData={post} handleModalClose={handleModalClose} />
            </ModalEditPost>
        </>
    );
}
