import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom';
import userService from '../../../services/user';
import { AuthContext } from '../../../context/auth';
import { useUserContext } from '../../../context/user'

export const useUserProfileActions = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [followingCount, setFollowingCount] = useState(null);
    const [followersCount, setFollowersCount] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [postComments, setPostComments] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isUserProfile, setIsUserProfile] = useState(false);
    const { user } = useContext(AuthContext);
    const { updateInfo } = useUserContext();
    const currentUserId = user ? user._id : null;
    const currentUserProfile = user ? user.username : null;

    const fetchUserData = async () => {
        if (!currentUserId) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await userService.getUser(username);
            const userInfo = response.data.userData;
    
            setUserData(userInfo);
            setFollowingCount(userInfo.following.count);
            setFollowersCount(userInfo.followers.count);
            setUserPosts(userInfo.userPost);
    
            if (!userInfo.userPost || userInfo.userPost.length === 0) {
                setSuccessMessage("There are no posts yet");
            }
    
            if (!userInfo.followers.users || userInfo.followers.users.length === 0) {
                setSuccessMessage("No followers found");
            }

            if (!userInfo.following.users || userInfo.following.users.length === 0) {
                setSuccessMessage("No following found");
            }
    
            setPostComments(userInfo.userPost.comments);
            setIsFollowing(userInfo.followers.users.includes(currentUserId));
    
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message);
            setIsLoading(false);
        }
    };
    

    const toggleFollowUser = async () => {
        try {
            const response = await userService.toggleFollowUser(username);
            if (response.data.success) {
                setIsFollowing(prevIsFollowing => !prevIsFollowing);
                setFollowersCount(prevCount => isFollowing ? prevCount - 1 : prevCount + 1);

                if (isFollowing) {
                    toast.info('UNFOLLOWED');
                } else {
                    toast.success('FOLLOWED');
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const isCurrentUserProfile = async () => {
        try {
            if (username === currentUserProfile) {
                setIsUserProfile(true)
            } else {
                setIsUserProfile(false)
            }
        } catch (error) {
            console.error('error catch');
        }
    }

    useEffect(() => {
        if (user) {
            fetchUserData();
            isCurrentUserProfile();
        }
    }, [username, user, updateInfo]);


    return {
        userData,
        isLoading,
        error,
        followingCount,
        followersCount,
        userPosts,
        postComments,
        isFollowing,
        toggleFollowUser,
        isUserProfile,
        successMessage
    };
};
