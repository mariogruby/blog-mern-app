import Post from '../models/post.js'
import User from '../models/user.js'
import cloudinaryConfig from '../config/cloudinary.js'

export const addPost = async (req, res) => {
    try {
        const { content, tags } = req.body;
        console.log('Tags recibidos:', tags);
        const userId = req.payload._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const imageBuffer = req.files.image.data;
        const imageBase64 = imageBuffer.toString('base64');

        const imageResult = await cloudinaryConfig.uploader.upload(`data:image/png;base64,${imageBase64}`, {
            resource_type: "auto",
            folder: "uploads"
        });
        if (!imageResult) {
            return res.status(404).json({ success: false, message: "Upload image error" });
        }

        const tagsArray = tags ? (Array.isArray(tags) ? tags : [tags]) : [];
        console.log('Tags como array:', tagsArray);

        const createPost = new Post({
            image: imageResult.secure_url,
            content,
            tags: tagsArray,
            author: user._id
        });

        await createPost.save();

        await User.findByIdAndUpdate(userId, {
            $push: { userPost: createPost._id }
        });

        return res.status(200).json({ success: true, post: createPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Error in server" });
    }
};

export const getPosts = async (req, res) => {
    try {
        const allPosts = await Post.find().populate('author', '_id username userImage');
        res.status(200).json({ success: true, allPosts });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: "Error get All Posts" })
    }
};
