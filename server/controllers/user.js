import User from '../models/user.js'
import Conversation from '../models/conversation.js';
import cloudinaryConfig from '../config/cloudinary.js'

export const getUser = async (req, res) => {
    try {
        const username = req.params.username;

        const userData = await User.findOne({ username }).populate({
            path: 'userPost',
            select: '_id image likes comments'
        });

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, userData: userData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const followUser = async (req, res) => {
    try {
        const userId = req.payload._id.toString();
        const followUsername = req.params.username;

        // Buscar al usuario actual
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Buscar al usuario a seguir/dejar de seguir
        const followUser = await User.findOne({ username: followUsername });
        if (!followUser) {
            return res.status(404).json({ success: false, message: "User to follow/unfollow not found" });
        }

        const followUserId = followUser._id.toString();
        const isFollowing = user.following.users.includes(followUserId);

        if (isFollowing) {
            // Dejar de seguir al usuario
            user.following.users = user.following.users.filter(followingUser => followingUser.toString() !== followUserId);
            user.following.count -= 1;

            followUser.followers.users = followUser.followers.users.filter(follower => follower.toString() !== userId);
            followUser.followers.count -= 1;
        } else {
            // Seguir al usuario
            user.following.users.push(followUserId);
            user.following.count += 1;

            followUser.followers.users.push(userId);
            followUser.followers.count += 1;
        }

        // Guardar los cambios
        await user.save();
        await followUser.save();

        return res.status(200).json({ success: true, message: isFollowing ? "No longer following the user" : "Now following the user" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const userLikedPost = async (req, res) => {
    try {
        const userId = req.payload._id;
        const user = await User.findById(userId).populate('likedPost.Post');

        if (!user) {
            return res.status(400).json({ success: false, message: 'User payload not found' });
        }

        return res.status(200).json({ success: true, likedPost: user.likedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

export const getSavedPosts = async (req, res) => {
    try {
        const userId = req.payload._id;

        const user = await User.findById(userId).populate({
            path: 'userSavedPost',
            populate: {
                path: 'author',
                select: 'username'
            },
            select: '_id image likes'
        })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.userSavedPost || user.userSavedPost.length === 0) {
            return res.status(200).json({ success: true, message: "User has no saved posts" })
        }

        return res.status(200).json({ success: true, savedPosts: user.userSavedPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const editUser = async (req, res) => {
    try {
        const userId = req.payload._id;
        const { name, lastName, username } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        let imageResult;

        if (req.files && req.files.image) {
            const imageBuffer = req.files.image.data;
            const imageBase64 = imageBuffer.toString('base64');

            imageResult = await cloudinaryConfig.uploader.upload(`data:image/png;base64,${imageBase64}`, {
                resource_type: "auto",
                folder: "uploads"
            });

            if (!imageResult) {
                return res.status(404).json({ success: false, message: "Upload image error" });
            }
        }

        user.name = name || user.name;
        user.lastName = lastName || user.lastName;
        user.username = username || user.username;
        if (imageResult) {
            user.userImage = imageResult.secure_url;
        }

        await user.save();

        return res.status(200).json({ success: true, message: "User updated successfully.", user });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

// export const getUsersForSidebar = async (req, res) => {
//     try {
//         const loggedInUserId = req.payload._id;

//         // Obtén el usuario logueado incluyendo la lista de usuarios seguidos
//         const loggedInUser = await User.findById(loggedInUserId).populate('following.users', '-password');

//         if (!loggedInUser) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         // Los usuarios que sigue el usuario logueado
//         const followedUsers = loggedInUser.following.users;

//         res.status(200).json({ success: true, followedUsers });
//     } catch (error) {
//         console.log("Error in getUsersForSidebar", error.message);
//         res.status(500).json({ success: false, error: "Internal server error." });
//     }
// };


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.payload._id;

        // Obtén las conversaciones en las que participa el usuario logueado
        const conversations = await Conversation.find({
            participants: { $in: [loggedInUserId] }
        })
        .populate('participants', '-password')
        .populate({
            path: 'messages',
            populate: { path: 'senderId', select: 'username' }
        });

        if (!conversations) {
            return res.status(404).json({ success: false, message: "No conversations found" });
        }

        // Filtra los participantes que no son el usuario logueado
        const participants = conversations
            .map(conversation => conversation.participants.filter(participant => participant._id.toString() !== loggedInUserId))
            .flat()
            .filter((participant, index, self) => 
                self.findIndex(p => p._id.toString() === participant._id.toString()) === index
            );

        res.status(200).json({ success: true, participants });
    } catch (error) {
        console.log("Error in getUsersForSidebar", error.message);
        res.status(500).json({ success: false, error: "Internal server error." });
    }
};
