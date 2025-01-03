import { create } from 'zustand';

const useChat = create((set)=> ({
    selectedChat: null,
    setSelectedChat:  (selectedChat) => set({selectedChat}),
    chatId: null,
    setChatId: (chatId) => set({chatId}),
    messages: [],
    setMessages: (messages) => set({messages}),
}))

export default useChat;