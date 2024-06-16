import axios from "axios";

class UserService {
    constructor() {
        this.user = axios.create({
            baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
        });
        this.user.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                config.headers.Authorization = `Bearer ${storedToken}`;
            }
            return config;
        });
    };

    userLikedPost = () => {
        return this.user.get('/user/userLikedPosts');
    };
    userSavedPost = () => {
        return this.user.get('/user/userSavedPosts');
    };
    
};

const userService = new UserService();

export default userService;