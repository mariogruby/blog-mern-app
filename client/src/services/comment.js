import axios from 'axios';

class CommentService {
    constructor() {
        this.comment = axios.create({
            baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
        });
        this.comment.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                config.headers.Authorization = `Bearer ${storedToken}`;
            }
            return config;
        });
    };

    addComment = (requestBody, postId) => {
        return this.comment.post(`/comment/${postId}/add-comment`, requestBody);
    };
    getCommentsPost = (postId) => {
        return this.comment.get(`comment/get-comments/${postId}`)
    };
};

const commentService = new CommentService();

export default commentService;