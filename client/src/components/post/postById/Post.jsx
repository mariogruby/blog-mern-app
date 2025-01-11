import React, { useState } from 'react';
import { usePostByIdActions } from './Actions';
import DropdownMenu from './Menu';
import AddComment from '../../comment/AddComment';
import ModalEditPost from '../../post/editPost/ModalEditPost';
import EditPost from '../../post/editPost/EditPost';
import { pink } from '@mui/material/colors';
import { format } from '@formkit/tempo';
import {
    Avatar,
    Card,
    CardContent,
    CardMedia,
    Button,
    IconButton,
    Box,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    MoreVert as MoreVertIcon,
    ModeCommentOutlined as ModeCommentOutlinedIcon,
    TurnedInNot as TurnedInNotIcon,
    TurnedIn as TurnedInIcon,
    SendOutlined as SendOutlinedIcon,
} from '@mui/icons-material';
import { useAllPostActions } from '../allPosts/Actions';
import ListChat from '../allPosts/ListDm'

export default function Post() {
    const {
        isAuthor,
        handleToggleLike,
        loadMoreComments,
        toggleExpand,
        handleMenu,
        handleMenuClose,
        handleEdit,
        handleModalClose,
        isExpanded,
        handleToggleSave,
        handleDeletePost,
        post,
        comments,
        likedPost,
        isLoading,
        showMessage,
        anchorEl,
        isModalOpen,
        visibleComments,
        savedPost,
        postId
    } = usePostByIdActions();

    const [isDialogOpen, setDialogOpen] = useState(false)
    const {
        handleCloseChatList,
        handleOpenChatList,
        openModalList,
        selectedPostId,
    } = useAllPostActions();

    const formatDate = (dateString) => {
        const l = "en";
        return format(new Date(dateString), "MMMM D, h:mm a", l);
    };

    //* Dialog handlers
    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const confirmDeletePost = async () => {
        handleDeletePost();
        closeDialog();
    }

    return (
        <>
            <Box sx={{ mt: { xs: '1px', sm: '1px', md: '15%', lg: '10%', xl: '8%', xxl: '20%' } }}>
                {isLoading ? (
                    <Card sx={{ maxWidth: 900, margin: 'auto', bgcolor: 'black', color: 'white' }}>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <Skeleton variant="rectangular" width="100%" height={400} animation="wave" />
                            </Grid>
                            <Grid item xs={12} md={6} display="flex" flexDirection="column">
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Box display="flex" alignItems="center" sx={{ borderBottom: '1px solid #3f3f46', paddingBottom: 2 }}>
                                        <Skeleton variant="circular" width={40} height={40} animation="wave" />
                                        <Box ml={2} display="flex" alignItems="center" flexGrow={1}>
                                            <Skeleton variant="text" width="50%" animation="wave" />
                                        </Box>
                                    </Box>
                                    <Box flexGrow={1} sx={{ borderBottom: '1px solid #3f3f46' }}>
                                        <Skeleton variant="text" width="100%" animation="wave" />
                                        <Skeleton variant="text" width="100%" animation="wave" />
                                        <Skeleton variant="text" width="100%" animation="wave" />
                                        <Skeleton variant="text" width="100%" animation="wave" />
                                        <Skeleton variant="text" width="100%" animation="wave" />
                                        <Skeleton variant="text" width="100%" animation="wave" />
                                        <Skeleton variant="text" width="100%" animation="wave" />
                                    </Box>
                                </CardContent>
                                <CardContent sx={{ mt: 'auto', pt: '1px' }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Skeleton variant="text" width="50%" animation="wave" />
                                    </Box>
                                    <Box mt={2}>
                                        <Skeleton variant="rectangular" width="100%" height={80} animation="wave" />
                                    </Box>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </Card>
                ) : post ? (
                    <Card sx={{ maxWidth: 900, margin: 'auto', mb: { xs: 7, sm: 7 }, bgcolor: 'black', color: 'white' }}>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <CardMedia
                                    component="img"
                                    image={post.image}
                                    alt="image"
                                    sx={{ width: '100%', height: '100%' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} display="flex" flexDirection="column">
                                <CardContent sx={{ flex: '1 0 auto', paddingBottom: 0 }}>
                                    <Box display="flex" alignItems="center" sx={{ borderBottom: '1px solid #3f3f46', paddingBottom: 2 }}>
                                        <Avatar alt={post.author.username} src={post.author.userImage} />
                                        <Box ml={2} display="flex" alignItems="center" flexGrow={1}>
                                            <Typography variant="h6" component="span" fontWeight="bold">{post.author.username}</Typography>
                                            <IconButton disabled={!isAuthor} aria-label="settings" onClick={handleMenu} sx={{ ml: 'auto' }}>
                                                <MoreVertIcon />
                                            </IconButton>
                                            <DropdownMenu
                                                anchorEl={anchorEl}
                                                handleMenuClose={handleMenuClose}
                                                handleEdit={handleEdit}
                                                handleDeletePost={openDialog} />
                                        </Box>
                                        {/*modal confirm delete */}
                                        <Dialog open={isDialogOpen} onClose={closeDialog}>
                                            <DialogTitle>Confirm Delete Post</DialogTitle>
                                            <DialogContent>
                                                <Typography>
                                                    Are you sure you want to delete this Post? This action cannot be undone.
                                                </Typography>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={closeDialog} color="primary" disabled={isLoading}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={confirmDeletePost} color="error" disabled={isLoading}>
                                                    {isLoading ? ' Deleting...' : 'Delete'}
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </Box>
                                    <Box flexGrow={1} >
                                        <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 230 }}>
                                            <ListItem alignItems="flex-start" key={post._id}>
                                                <ListItemAvatar>
                                                    <Avatar alt={post.author.username} src={post.author.userImage} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body1"
                                                                sx={{ fontWeight: 'bold' }}>
                                                                {post.author.username}
                                                            </Typography>
                                                            {' - '}
                                                            <Typography
                                                                component="span"
                                                                variant="subtitle2"
                                                                color="text.secondary"
                                                                sx={{ marginLeft: 1 }}>
                                                                {formatDate(post.createdAt)}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: isExpanded(post._id) ? 'unset' : 3,
                                                                    WebkitBoxOrient: 'vertical',
                                                                }}>
                                                                {post.content}
                                                            </Typography>
                                                            {post.content.length > 200 && !isExpanded(post._id) && (
                                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                    <Button size="small" onClick={() => toggleExpand(post._id)} sx={{ mt: 1 }}>
                                                                        Read more
                                                                    </Button>
                                                                </Box>
                                                            )}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            {comments.length === 0 ? (
                                                <Typography sx={{ textAlign: 'center', mt: 2 }}>There are no comments yet, be the first to comment</Typography>
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
                                                ))
                                            )}
                                            {showMessage && (
                                                <Box textAlign="center" mb={1}>
                                                    <Button onClick={loadMoreComments}>Show more comments</Button>
                                                </Box>
                                            )}
                                        </List>
                                    </Box>
                                </CardContent>
                                <CardContent sx={{ mt: 'auto', paddingTop: 0 }}>
                                    <Box display="flex" alignItems="center" pb={0} pt={2} sx={{ borderTop: '1px solid #3f3f46' }}>
                                        <IconButton aria-label="add to favorites"
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
                                        <IconButton
                                            aria-label="share"
                                            onClick={() => handleOpenChatList(post._id)}
                                        >
                                            <SendOutlinedIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="save"
                                            onClick={() => handleToggleSave(post._id)}
                                            sx={{ ml: 'auto' }}>
                                            {savedPost.includes(post._id) ? (
                                                <TurnedInIcon />
                                            ) : (
                                                <TurnedInNotIcon />
                                            )}
                                        </IconButton>
                                    </Box>
                                    <Box mt={2}>
                                        <AddComment />
                                    </Box>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </Card>
                ) : (
                    <p>Post not found</p>
                )}
                <ModalEditPost open={isModalOpen} handleClose={handleModalClose}>
                    <EditPost postId={postId} initialData={post} handleModalClose={handleModalClose} />
                </ModalEditPost>
                <ListChat open={openModalList} handleClose={handleCloseChatList} postId={selectedPostId} />
            </Box>
        </>
    );
}
