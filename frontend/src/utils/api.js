import axios from 'axios';

// local
// const API_BASE_URL = 'http://localhost:5001/api';

// koyeb
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const getConversations = async () => {
    const response = await axios.get(`${API_BASE_URL}/conversations`);
    return response.data;
};

export const getMessages = async (conversationId) => {
    const response = await axios.get(`${API_BASE_URL}/messages/${conversationId}`);
    return response.data;
};

export const createMessage = async (conversationId, content) => {
    const response = await axios.post(`${API_BASE_URL}/messages`, {
        conversationId,
        sender: 'user',
        content,
    });
    return response.data;
};
