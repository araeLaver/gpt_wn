const axios = require('axios');

const callGPTAPI = async (messages) => {
    const API_URL = 'https://api.openai.com/v1/chat/completions';

    try {
        console.log('Calling GPT API with messages:', messages); // 요청 로그
        const response = await axios.post(
            API_URL,
            {
                // model: 'gpt-3.5-turbo',
                model: 'gpt-4o',
                messages,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GPT_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('GPT API Response:', response.data); // 응답 로그
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling GPT API:', error.response?.data || error.message); // 에러 로그
        throw new Error('Failed to call GPT API');
    }
};

module.exports = callGPTAPI;
