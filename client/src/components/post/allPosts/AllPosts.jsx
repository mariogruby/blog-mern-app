import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/auth'
import { useAllPostActions } from './Actions';
import { pink } from '@mui/material/colors';
import { format } from '@formkit/tempo';
import {
    Box,
    Grid,
    Card,
    CardHeader,
    CardContent,
    CardMedia,
    Avatar,
    Typography,
    IconButton,
    Skeleton,
    CardActions,
    Chip,
    Button
} from '@mui/material';
import {
    Share as ShareIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    MoreVert as MoreVertIcon,
    ModeCommentOutlined as ModeCommentOutlinedIcon,
    TurnedInNot as TurnedInNotIcon,
    TurnedIn as TurnedInIcon
} from '@mui/icons-material';
import AlertModal from '../../alerts/NoAuth';

//TODO: pending successMessage implementation and clean code
//TODO: scroll bottom detector for load more posts 

export default function AllPosts() {
    const {
        handleToggleLike,
        handleToggleSave,
        toggleExpand,
        isExpanded,
        posts,
        isLoading,
        isLoadingMorePosts,
        errorMessage,
        // successMessage,
        likedPosts,
        savedPosts,
        fetchData,
        page,
        totalPages,
        setPage,
        handleLoadMore
    } = useAllPostActions();

    const { isLoggedIn } = useContext(AuthContext)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatDate = (dateString) => {
        const l = "en";
        return format(new Date(dateString), "MMMM D, h:mm a", l);
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const handleUsernameClick = (event) => {
        if (!isLoggedIn) {
            event.preventDefault();
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} columns={2}>
                {isLoading ? (
                    Array.from(new Array(6)).map((_, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Card sx={{ width: { xs: '100%', sm: '545px' }, ml: { xs: 0, sm: 1, md: 8, lg: '300px', xl: '350px' } }}>
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
                        <>
                            {posts.map((post) => (
                                <Grid item xs={12} sm={6} key={post._id}>
                                    <Card sx={{ width: { xs: '100%', sm: '545px' }, ml: { xs: 0, sm: 1, md: 8, lg: '300px', xl: '350px' } }}>
                                        <CardHeader
                                            avatar={<Avatar alt={post.author.username} src={post.author.userImage} />}
                                            action={
                                                <IconButton aria-label="settings">
                                                    <MoreVertIcon />
                                                </IconButton>
                                            }
                                            title={<Link to={`/${post.author.username}`} onClick={handleUsernameClick}>
                                                <Typography variant="h7" component="span" fontWeight="bold">
                                                    {post.author.username}
                                                </Typography>
                                            </Link>}
                                        />
                                        <Link to={`/post/${post._id}`}>
                                            <CardMedia
                                                component="img"
                                                image={post.image}
                                                alt='image'
                                                style={{ maxWidth: '100%', height: '90%' }}
                                            />
                                        </Link>
                                        <CardActions disableSpacing sx={{ mt: 1, ml: 0.5, p: 0 }}>
                                            <IconButton
                                                aria-label="add to favorites"
                                                onClick={() => handleToggleLike(post._id)}>
                                                {likedPosts.includes(post._id) ? (
                                                    <FavoriteIcon sx={{ color: pink[500] }} />
                                                ) : (
                                                    <FavoriteBorderIcon />
                                                )}
                                            </IconButton>
                                            <Link to={`/post/${post._id}`}>
                                                <IconButton
                                                    aria-label="add a comment">
                                                    <ModeCommentOutlinedIcon />
                                                </IconButton>
                                            </Link>
                                            <IconButton aria-label="share">
                                                <ShareIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="save"
                                                onClick={() => handleToggleSave(post._id)}
                                                sx={{ ml: 'auto' }}>
                                                {savedPosts.includes(post._id) ? (
                                                    <TurnedInIcon />
                                                ) : (
                                                    <TurnedInNotIcon />
                                                )}
                                            </IconButton>
                                        </CardActions>
                                        <Box sx={{ ml: 2 }}>
                                            <Typography variant="body2" color="text.secondary" component="p" sx={{ fontWeight: 'bold' }}>
                                                {`${post.likes} Likes`}
                                            </Typography>
                                        </Box>
                                        <CardContent sx={{ pt: 1 }}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                component="p"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: isExpanded(post._id) ? 'unset' : 1,
                                                    WebkitBoxOrient: 'vertical'
                                                }}
                                            >
                                                <span onClick={() => toggleExpand(post._id)} style={{ display: 'inline' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: 14 }}>{post.author.username}</span>{' '}
                                                    {capitalizeFirstLetter(post.content)}
                                                </span>
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontSize: '0.75rem', mt: 1 }}
                                            >
                                                {formatDate(post.createdAt).toUpperCase()}
                                            </Typography>
                                            <Box direction="row" spacing={1} sx={{ mt: 1 }}>
                                                {post.tags.map((tag, index) => (
                                                    <Chip size="small" key={index} label={tag} sx={{ m: 0.3 }} />
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {page < totalPages && (
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    <Button
                                        onClick={handleLoadMore}
                                        variant="contained"
                                        color="primary"
                                        disabled={isLoadingMorePosts} // Deshabilitar el botón mientras se cargan más posts
                                    >
                                        {isLoadingMorePosts ? 'Loading...' : 'Load More'}
                                    </Button>
                                </Grid>
                            )}
                        </>
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
            </Grid>
            <AlertModal open={isModalOpen} handleClose={handleCloseModal} />
        </Box>
    );
}





// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { usePostContext } from '../../../context/post';
// import { fetchData, fetchLikedPosts, handleToggleLike, fetchSavedPosts, handleToggleSave } from './Actions';
// import { pink } from '@mui/material/colors';
// import { styled } from '@mui/material/styles';
// import { format } from '@formkit/tempo';
// import {
//     Box,
//     Grid,
//     Card,
//     CardHeader,
//     CardContent,
//     CardMedia,
//     Avatar,
//     Typography,
//     IconButton,
//     Skeleton,
//     CardActions,
//     Button,
//     Chip,
//     Stack
// } from '@mui/material';
// import {
//     Share as ShareIcon,
//     Favorite as FavoriteIcon,
//     FavoriteBorder as FavoriteBorderIcon,
//     MoreVert as MoreVertIcon,
//     ModeCommentOutlined as ModeCommentOutlinedIcon,
//     TurnedInNot as TurnedInNotIcon,
//     TurnedIn as TurnedInIcon
// } from '@mui/icons-material';

// export default function AllPosts() {
//     const { updatePost } = usePostContext();
//     const [posts, setPosts] = useState([]);
//     const [expandedIds, setExpandedIds] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState(null);
//     const [successMessage, setSuccessMessage] = useState(null);
//     const [likedPosts, setLikedPosts] = useState([]);
//     const [savedPosts, setSavedPosts] = useState([]);

//     const formatDate = (dateString) => {
//         const l = "en";
//         return format(new Date(dateString), "MMMM D, h:mm a", l);
//     };

//     useEffect(() => {
//         fetchData(setPosts, setIsLoading, setErrorMessage, setSuccessMessage);
//     }, [updatePost]);

//     useEffect(() => {
//         fetchLikedPosts(setLikedPosts);
//     }, []);

//     useEffect(() => {
//         fetchSavedPosts(setSavedPosts)
//     }, []);

//     const handleLikeClick = (postId) => {
//         handleToggleLike(postId, setPosts, setLikedPosts);
//     };

//     const handleSaveClick = (postId) => {
//         handleToggleSave(postId, setSavedPosts)
//     };

//     const toggleExpand = (postId) => {
//         if (expandedIds.includes(postId)) {
//             setExpandedIds(expandedIds.filter(id => id !== postId));
//         } else {
//             setExpandedIds([...expandedIds, postId]);
//         }
//     };

//     const isExpanded = (postId) => {
//         return expandedIds.includes(postId);
//     };

//     // Función para capitalizar la primera letra de una cadena
//     function capitalizeFirstLetter(string) {
//         return string.charAt(0).toUpperCase() + string.slice(1);
//     }

//     return (
//         <Box sx={{ flexGrow: 1 }}>
//             <Grid container spacing={2} columns={2}>
//                 {isLoading ? (
//                     Array.from(new Array(6)).map((_, index) => (
//                         <Grid item xs={8} key={index}>
//                             <Card sx={{ maxWidth: 545, m: 2 }}>
//                                 <CardHeader
//                                     avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
//                                     action={null}
//                                     title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
//                                     subheader={<Skeleton animation="wave" height={10} width="40%" />}
//                                 />
//                                 <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
//                                 <CardContent>
//                                     <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
//                                     <Skeleton animation="wave" height={10} width="80%" />
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     ))
//                 ) : (
//                     posts.length > 0 ? (
//                         posts.map((post) => (
//                             <Grid item xs={8} key={post._id}>
//                                 <Card sx={{ maxWidth: 545, m: 2 }}>
//                                     <CardHeader
//                                         avatar={<Avatar alt={post.author.username} src={post.author.userImage} />}
//                                         action={
//                                             <IconButton aria-label="settings">
//                                                 <MoreVertIcon />
//                                             </IconButton>
//                                         }
//                                         title={post.author.username}
//                                     // subheader={formatDate(post.createdAt)}
//                                     />
//                                     <CardMedia
//                                         component="img"
//                                         image={post.image}
//                                         alt='image'
//                                         style={{ maxWidth: '100%', height: '90%' }}
//                                     />
//                                     <CardActions disableSpacing sx={{ mt: 1, ml: 0.5, p: 0 }}>
//                                         <IconButton
//                                             aria-label="add to favorites"
//                                             onClick={() => handleLikeClick(post._id)}>
//                                             {likedPosts.includes(post._id) ? (
//                                                 <FavoriteIcon sx={{ color: pink[500] }} />
//                                             ) : (
//                                                 <FavoriteBorderIcon />
//                                             )}
//                                         </IconButton>
//                                         <Link to={`/post/${post._id}`}>
//                                             <IconButton
//                                                 aria-label="add a comment">
//                                                 <ModeCommentOutlinedIcon />
//                                             </IconButton>
//                                         </Link>
//                                         <IconButton aria-label="share">
//                                             <ShareIcon />
//                                         </IconButton>
//                                         <IconButton
//                                             aria-label="save"
//                                             onClick={() => handleSaveClick(post._id)}
//                                             sx={{ ml: 'auto' }}>
//                                             {savedPosts.includes(post._id) ? (
//                                                 <TurnedInIcon />
//                                             ) : (
//                                                 <TurnedInNotIcon />
//                                             )}
//                                         </IconButton>
//                                     </CardActions>
//                                     <Box sx={{ ml: 2 }}>
//                                         <Typography variant="body2" color="text.secondary" component="p" sx={{ fontWeight: 'bold' }}>
//                                             {`${post.likes} Likes`}
//                                         </Typography>
//                                     </Box>
//                                     <CardContent sx={{ pt: 1 }}>
//                                         <Typography
//                                             variant="body2"
//                                             color="text.secondary"
//                                             component="p"
//                                             sx={{
//                                                 overflow: 'hidden',
//                                                 textOverflow: 'ellipsis',
//                                                 display: '-webkit-box',
//                                                 WebkitLineClamp: isExpanded(post._id) ? 'unset' : 1,
//                                                 WebkitBoxOrient: 'vertical'
//                                             }}
//                                         >
//                                             <span onClick={() => toggleExpand(post._id)} style={{ display: 'inline' }}>
//                                                 <span style={{ fontWeight: 'bold', fontSize: 14 }}>{post.author.username}</span>{' '}
//                                                 {capitalizeFirstLetter(post.content)}
//                                             </span>
//                                         </Typography>
//                                         <Typography
//                                             variant="body2"
//                                             color="text.secondary"
//                                             sx={{ fontSize: '0.75rem', mt: 1 }}
//                                         >
//                                             {formatDate(post.createdAt).toUpperCase()}
//                                         </Typography>
//                                         {/* {post.content.length > 200 && !isExpanded(post._id) && (
//                                             <Button onClick={() => toggleExpand(post._id)} sx={{ mt: 1}} size="small">
//                                                 read more
//                                             </Button>
//                                         )} */}
//                                         <Box direction="row" spacing={1} sx={{ xs: '255px', sm: '300px', md: '400px', lg: '545px', mt: 1 }}>
//                                             {post.tags.map((tag, index) => (
//                                                 <Chip size="small" key={index} label={tag} sx={{ m: 0.3 }} />
//                                             ))}
//                                         </Box>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                         ))
//                     ) : (
//                         <Typography variant="body2" color="text.secondary" component="p">
//                             No posts available.
//                         </Typography>
//                     )
//                 )}
//                 {errorMessage && (
//                     <Typography variant="body2" color="error" component="p">
//                         {errorMessage}
//                     </Typography>
//                 )}
//             </Grid>
//         </Box>
//     );
// }
