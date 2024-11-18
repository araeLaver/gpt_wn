
// const { Configuration, OpenAIApi } = require('openai');
// require('dotenv').config();

// console.log("API Key Loaded:", process.env.GPT_API_KEY ? "Yes" : "No");
// // OpenAI 설정
// const configuration = new Configuration({
//     apiKey: process.env.GPT_API_KEY, // 환경 변수에서 API 키 로드
// });
// console.log("API Key Loaded:", !!process.env.GPT_API_KEY);
// console.log("Configuration instance created:", configuration);

// const openai = new OpenAIApi(configuration);

// // GPT API 호출 함수
// const callGPTAPI = async (messages) => {
//     try {
//         console.log('Calling GPT API with messages:', messages);

//         const response = await openai.createChatCompletion({
//             model: 'gpt-4o', // gpt-4 모델 사용
//             messages,       // 대화 메시지 배열
//             max_tokens: 8000, // 최대 토큰 (모델 한계 내에서 조정 가능)
//             temperature: 0.7, // 응답의 창의성 조정 (0.0 ~ 1.0)
//         });

//         const gptResponse = response.data.choices[0].message.content;
//         console.log('GPT API Response:', gptResponse);

//         return gptResponse; // GPT 응답 반환
//     } catch (error) {
//         console.error('Error calling GPT API:', error.response?.data || error.message);
//         throw new Error('Failed to call GPT API');
//     }
// };

// module.exports = callGPTAPI;



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
                max_tokens: 8000, // 최대 토큰 (모델 한계 내에서 조정 가능)
                temperature: 0.7, // 응답의 창의성 조정 (0.0 ~ 1.0)
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
