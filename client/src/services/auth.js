import axios from "axios";

class AuthService {
    constructor() {
        this.auth = axios.create({
            baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
        });
        this.auth.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken")
            if (storedToken) {
                config.headers.Authorization = `Bearer ${storedToken}`;
            }
            return config;
        });
    };
    signup = (requestBody) => {
        return this.auth.post("auth/signup", requestBody);
    };
    login = (requestBody) => {
        return this.auth.post("auth/login", requestBody);
    };
    verify = () => {
        return this.auth.get("auth/verify");
    };
};

const authService = new AuthService();

export default authService;