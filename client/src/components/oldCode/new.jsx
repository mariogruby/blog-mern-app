// import React from 'react';
// import { usePostByIdActions } from './Actions';
// import DropdownMenu from './Menu';
// import AddComment from '../../comment/AddComment';
// import ModalEditPost from '../../post/editPost/ModalEditPost';
// import EditPost from '../../post/editPost/EditPost';
// import { pink } from '@mui/material/colors';
// import { format } from '@formkit/tempo';
// import {
//     Avatar,
//     Card,
//     CardContent,
//     CardMedia,
//     TextField,
//     Button,
//     IconButton,
//     Box,
//     Typography,
//     Grid,
//     List,
//     ListItem,
//     ListItemAvatar,
//     ListItemText,
//     Skeleton
// } from '@mui/material';
// import {
//     Favorite as FavoriteIcon,
//     FavoriteBorder as FavoriteBorderIcon,
//     Reply as ReplyIcon,
//     Share as ShareIcon,
//     MoreVert as MoreVertIcon,
//     ModeCommentOutlined as ModeCommentOutlinedIcon
// } from '@mui/icons-material';

// export default function Component({ onClick }) {
//     const {
//         handleToggleLike,
//         loadMoreComments,
//         toggleExpand,
//         handleMenu,
//         handleMenuClose,
//         handleEdit,
//         handleModalClose,
//         isExpanded,
//         post,
//         comments,
//         likedPost,
//         isLoading,
//         showMessage,
//         anchorEl,
//         isModalOpen,
//         visibleComments,
//         postId
//     } = usePostByIdActions();

//     const formatDate = (dateString) => {
//         const l = "en";
//         return format(new Date(dateString), "MMMM D, h:mm a", l);
//     };

//     return (
//         <>
//             {isLoading ? (
//                 <Card sx={{ maxWidth: 800, margin: 'auto', bgcolor: 'black', color: 'white' }}>
//                     <Grid container>
//                         <Grid item xs={12} md={6}>
//                             <Skeleton variant="rectangular" width="100%" height={300} animation="wave" />
//                         </Grid>
//                         <Grid item xs={12} md={6} display="flex" flexDirection="column">
//                             <CardContent sx={{ flex: '1 0 auto' }}>
//                                 <Box display="flex" alignItems="center" sx={{ borderBottom: '1px solid #3f3f46', paddingBottom: 2 }}>
//                                     <Skeleton variant="circular" width={40} height={40} animation="wave" />
//                                     <Box ml={2} display="flex" alignItems="center" flexGrow={1}>
//                                         <Skeleton variant="text" width="50%" animation="wave" />
//                                         <IconButton aria-label="settings" sx={{ ml: 'auto' }}>
//                                             <MoreVertIcon />
//                                         </IconButton>
//                                     </Box>
//                                 </Box>
//                                 <Box flexGrow={1} sx={{ borderBottom: '1px solid #3f3f46' }}>
//                                     <Skeleton variant="text" width="80%" animation="wave" />
//                                     <Skeleton variant="text" width="60%" animation="wave" />
//                                     <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
//                                 </Box>
//                             </CardContent>
//                             <CardContent sx={{ mt: 'auto', pt: '1px' }}>
//                                 <Box display="flex" alignItems="center" mb={2}>
//                                     <Skeleton variant="circular" width={40} height={40} animation="wave" />
//                                     <Skeleton variant="text" width="20%" animation="wave" />
//                                     <IconButton aria-label="add a comment">
//                                         <ModeCommentOutlinedIcon />
//                                     </IconButton>
//                                     <IconButton color="inherit">
//                                         <ShareIcon />
//                                     </IconButton>
//                                 </Box>
//                                 <Box mt={2}>
//                                     <AddComment />
//                                 </Box>
//                             </CardContent>
//                         </Grid>
//                     </Grid>
//                 </Card>
//             ) : post ? (
//                 <Card sx={{ maxWidth: 800, margin: 'auto', bgcolor: 'black', color: 'white' }}>
//                     <Grid container>
//                         <Grid item xs={12} md={6}>
//                             <CardMedia
//                                 component="img"
//                                 image={post.image}
//                                 alt="image"
//                                 sx={{ width: '100%', height: '100%' }}
//                             />
//                         </Grid>
//                         <Grid item xs={12} md={6} display="flex" flexDirection="column">
//                             <CardContent sx={{ flex: '1 0 auto' }}>
//                                 <Box display="flex" alignItems="center" sx={{ borderBottom: '1px solid #3f3f46', paddingBottom: 2 }}>
//                                     <Avatar alt={post.author.username} src={post.author.userImage} />
//                                     <Box ml={2} display="flex" alignItems="center" flexGrow={1}>
//                                         <Typography variant="h6" component="span" fontWeight="bold">{post.author.username}</Typography>
//                                         <IconButton aria-label="settings" onClick={handleMenu} sx={{ ml: 'auto' }}>
//                                             <MoreVertIcon />
//                                         </IconButton>
//                                         <DropdownMenu anchorEl={anchorEl} handleMenuClose={handleEdit} />
//                                     </Box>
//                                 </Box>
//                                 {/* <Typography variant="body2" color="textSecondary">{formatDate(post.createdAt)}</Typography> */}
//                                 <Box flexGrow={1} sx={{ borderBottom: '1px solid #3f3f46' }}>
//                                     {comments.length === 0 ? (
//                                         <Typography>There are no comments yet, be the first to comment</Typography>
//                                     ) : (
//                                         <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 200 }}>
//                                             <Box>
//                                                 <ListItem alignItems="flex-start" key={post._id}>
//                                                     <ListItemAvatar>
//                                                         <Avatar alt={post.author.username} src={post.author.userImage} />
//                                                     </ListItemAvatar>
//                                                     <ListItemText
//                                                         primary={
//                                                             <React.Fragment>
//                                                                 <Typography
//                                                                     component="span"
//                                                                     variant="body1"
//                                                                     sx={{ fontWeight: 'bold' }}>
//                                                                     {post.author.username}
//                                                                 </Typography>
//                                                                 {' - '}
//                                                                 <Typography
//                                                                     component="span"
//                                                                     variant="subtitle2"
//                                                                     color="text.secondary"
//                                                                     sx={{ marginLeft: 1 }}>
//                                                                     {formatDate(post.createdAt)}
//                                                                 </Typography>
//                                                             </React.Fragment>
//                                                         }
//                                                         secondary={
//                                                             <React.Fragment>
//                                                                 <Typography
//                                                                     variant="body1"
//                                                                     sx={{
//                                                                         overflow: 'hidden',
//                                                                         textOverflow: 'ellipsis',
//                                                                         display: '-webkit-box',
//                                                                         WebkitLineClamp: isExpanded(post._id) ? 'unset' : 3,
//                                                                         WebkitBoxOrient: 'vertical',
//                                                                     }}>
//                                                                     {post.content}
//                                                                 </Typography>
//                                                                 {post.content.length > 200 && !isExpanded(post._id) && (
//                                                                     <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                                                                         <Button size="small" onClick={() => toggleExpand(post._id)} sx={{ mt: 1 }}>
//                                                                             Read more
//                                                                         </Button>
//                                                                     </Box>
//                                                                 )}
//                                                             </React.Fragment>
//                                                         }
//                                                     />
//                                                 </ListItem>

//                                             </Box>
//                                             {comments.slice(0, visibleComments).map(comment => (
//                                                 <ListItem alignItems="flex-start" key={comment._id}>
//                                                     <ListItemAvatar>
//                                                         <Avatar alt={comment.author.username} src={comment.author.userImage} />
//                                                     </ListItemAvatar>
//                                                     <ListItemText
//                                                         primary={
//                                                             <React.Fragment>
//                                                                 <Typography
//                                                                     component="span"
//                                                                     variant="body1"
//                                                                     sx={{ fontWeight: 'bold' }}>
//                                                                     {comment.author.username}
//                                                                 </Typography>
//                                                                 {' - '}
//                                                                 <Typography
//                                                                     component="span"
//                                                                     variant="subtitle2"
//                                                                     color="text.secondary"
//                                                                     sx={{ marginLeft: 1 }}>
//                                                                     {formatDate(comment.createdAt)}
//                                                                 </Typography>
//                                                             </React.Fragment>
//                                                         }
//                                                         secondary={
//                                                             <React.Fragment>
//                                                                 <Typography
//                                                                     sx={{ display: 'inline' }}
//                                                                     component="span"
//                                                                     variant="body2"
//                                                                     color="text.primary">
//                                                                     {comment.content}
//                                                                 </Typography>
//                                                             </React.Fragment>
//                                                         }
//                                                     />
//                                                 </ListItem>
//                                             ))}
//                                             {showMessage && (
//                                                 <Box textAlign="center" mb={1}>
//                                                     <Button onClick={loadMoreComments}>Show more comments</Button>
//                                                 </Box>
//                                             )}
//                                         </List>
//                                     )}
//                                 </Box>
//                             </CardContent>
//                             <CardContent sx={{ mt: 'auto', pt: '1px' }}>
//                                 <Box display="flex" alignItems="center" mb={2}>
//                                     <IconButton aria-label="add to favorites"
//                                         onClick={() => handleToggleLike(post._id)}
//                                     >
//                                         {likedPost.includes(post._id) ? (
//                                             <FavoriteIcon sx={{ color: pink[500] }} />
//                                         ) : (
//                                             <FavoriteBorderIcon />
//                                         )}
//                                     </IconButton>
//                                     <Typography variant="body2" color="text.secondary" component="p">
//                                         {post.likes}
//                                     </Typography>
//                                     <IconButton
//                                         aria-label="add a comment">
//                                         <ModeCommentOutlinedIcon />
//                                     </IconButton>
//                                     <IconButton color="inherit">
//                                         <ShareIcon />
//                                     </IconButton>
//                                 </Box>
//                                 <Box mt={2}>
//                                     <AddComment />
//                                 </Box>
//                             </CardContent>
//                         </Grid>
//                     </Grid>
//                 </Card>
//             ) : (
//                 <p>Post not found</p>
//             )}
//             <ModalEditPost open={isModalOpen} handleClose={handleModalClose}>
//                 <EditPost postId={postId} initialData={post} handleModalClose={handleModalClose} />
//             </ModalEditPost>
//         </>
//     );
// }
