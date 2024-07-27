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

        // Parsear los tags recibidos como string de JSON
        const tagsArray = tags ? JSON.parse(tags) : [];
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
        const { page = 1, limit = 5 } = req.query;
        const skip = (page - 1) * limit;
        const allPosts = await Post.find()
            .populate('author', '_id username userImage')
            .skip(skip)
            .sort({ createdAt: -1 }) 
            .limit(Number(limit));
        
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({ 
            success: true, 
            allPosts,
            totalPages,
            currentPage: Number(page)
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: "Error getting all posts" })
    }
};

export const likePost = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.postId;

        // Busca el usuario por su ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Busca el post por su ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Verifica si el usuario ya ha dado like a este post
        const likedPostIndex = user.likedPost.findIndex(like => like.Post.toString() === postId);

        if (likedPostIndex !== -1) {
            if (user.likedPost[likedPostIndex].liked) {
                // Si ya le había dado like, entonces removemos el like y eliminamos el registro
                user.likedPost.splice(likedPostIndex, 1);
                post.likes -= 1;
            } else {
                // Este caso no debería ocurrir ya que si liked es false no debería estar en la lista, pero lo manejamos por si acaso
                user.likedPost[likedPostIndex].liked = true;
                post.likes += 1;
            }
        } else {
            // Si el usuario no ha interactuado con el post antes, agregamos un nuevo registro de like
            user.likedPost.push({ Post: postId, liked: true });
            post.likes += 1;
        }

        // Guardamos los cambios
        await user.save();
        await post.save();

        res.status(200).json({ success: true, message: "Post liked/unliked successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred while liking/unliking the post" });
    }
};

export const getPostById = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.postId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const post = await Post.findById(postId).populate('author', '_id username userImage');
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        return res.status(200).json({ success: true, post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Error getting the Post" });
    }
};

export const editPost = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.postId;
        const { content, tags } = req.body;


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Verificar que el usuario que intenta editar el post es el autor
        if (post.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        if (content) post.content = content;
        if (tags) post.tags = Array.isArray(tags) ? tags : [tags];

        await post.save();

        return res.status(200).json({ success: true, post });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error editing post" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.postId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Verificar que el usuario que intenta eliminar el post es el autor
        if (post.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        await post.deleteOne();

        // Eliminar el post de la lista de posts del usuario
        user.userPost.pull(postId);
        await user.save();

        return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error deleting post" });
    }
};

export const savePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.payload._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const savedPostIndex = user.userSavedPost.findIndex(savedPost => savedPost.toString() === postId);

        if (savedPostIndex !== -1) {
            // Eliminar el post guardado
            user.userSavedPost.splice(savedPostIndex, 1);
            await user.save();
            return res.status(200).json({ success: true, message: "Post removed from saved posts" });
        }
        // Agregar el post a los guardados
        // console.log("savedPostIndex:", savedPostIndex)
        user.userSavedPost.push(postId);
        await user.save();

        return res.status(200).json({ success: true, message: "Post saved successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
