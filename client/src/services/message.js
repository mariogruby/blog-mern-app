import axios from 'axios';
// import { toast } from 'react-toastify';

class MessageService {
    constructor() {
        this.msg = axios.create({
            baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
        });
        this.msg.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                config.headers.Authorization = `Bearer ${storedToken}`;
            }
            return config;
        });
    };
    sendMessage = (chatId, message, postId = null) => { // parámetro opcional postId
        return this.msg.post(`/api/message/send/${chatId}`, { message, postId });
    };
    getMessages = (chatId) => {
        return this.msg.get(`/api/message/${chatId}`);
    }
};

const messageService = new MessageService();

export default messageService;