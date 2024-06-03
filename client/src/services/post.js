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

    getAllPosts = () => {
        return this.postNoAuth.get('/posts/all-posts')
    };  
    addPost = (formData) => {
        return this.post.post('/posts/new-post', formData);
    }
};

const postService = new PostService();

export default postService;