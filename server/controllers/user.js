import User from '../models/user.js'

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

        const user = await User.findById(userId).populate('userSavedPost');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, savedPosts: user.userSavedPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

