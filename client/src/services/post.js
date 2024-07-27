import axios from 'axios';

class PostService {
    constructor() {
        this.post = axios.create({
            baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
        });
        this.post.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                config.headers.Authorization = `Bearer ${storedToken}`;
            }
            return config;
        });
        this.postNoAuth = axios.create({
            baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
        });
    };

    getAllPosts = (page = 1, limit = 5) => {
        return this.postNoAuth.get(`/posts/all-posts?page=${page}&limit=${limit}`);
    };   
    addPost = (formData) => {
        return this.post.post('/posts/new-post', formData);
    };
    likePost = (postId) => {
        return this.post.post(`/posts/${postId}/like`);
    };
    getPostById = (postId) => {
        return this.post.get(`/posts/${postId}`);
    };
    editPost = (postId, requestBody) => {
        return this.post.put(`/posts/${postId}/edit`, requestBody);
    };
    deletePost = (postId) => {
        return this.post.delete(`/posts/${postId}/delete`);
    };
    savePost = (postId) => {
        return this.post.post(`/posts/${postId}/save`);
    };
};

const postService = new PostService();

export default postService;