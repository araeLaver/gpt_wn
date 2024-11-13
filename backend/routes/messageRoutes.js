const express = require('express');
const {
    getMessagesByConversationId, // 특정 대화의 메시지 목록을 가져오는 함수
    addMessage, // 새로운 메시지를 데이터베이스에 저장하는 함수
} = require('../models/message');
const callGPTAPI = require('../config/gpt'); // GPT API 호출 함수
const logger = require('../utils/logger');
const router = express.Router();

// **Get messages for a conversation**
// 특정 대화(conversation)의 모든 메시지를 가져오는 API
router.get('/:conversationId', async (req, res) => {
    try {
        // 1. 요청된 대화 ID로 메시지 목록 가져오기
        const messages = await getMessagesByConversationId(req.params.conversationId);
        res.json(messages); // 2. 메시지 목록 반환
    } catch (error) {
        console.error('Error fetching messages:', error); // 에러 로그
        res.status(500).json({ error: 'Failed to fetch messages' }); // 3. 에러 응답
    }
});

// **Add a new message and get GPT response**
// 사용자의 메시지를 저장하고, GPT API를 호출한 후 응답을 저장하는 API
router.post('/', async (req, res) => {
    const { conversationId, sender, content } = req.body;

    // 입력값 검증: conversationId, sender, content가 없을 경우 에러 반환
    if (!conversationId || !sender || !content) {
        logger.warn('Bad request: Missing conversationId, sender, or content');
        return res.status(400).json({ error: 'conversationId, sender, and content are required' });
    }

    try {
        console.log(`Received message: "${content}" from sender: "${sender}"`); // 요청 메시지 로그
        logger.info(`Received message: "${content}" from sender: "${sender}"`);

        // **Step 1: 사용자의 메시지 저장**
        const userMessage = await addMessage(conversationId, sender, content);
        console.log('User message saved:', userMessage); // 저장된 메시지 로그
        logger.info(`User message saved: ${JSON.stringify(userMessage)}`);

        // **Step 2: 해당 대화의 기존 메시지 가져오기**
        const messages = await getMessagesByConversationId(conversationId);
        console.log(`Fetched ${messages.length} previous messages for conversation ${conversationId}`);
        logger.info(`Fetched ${messages.length} previous messages for conversation ${conversationId}`);

        // **Step 3: GPT API에 전달할 메시지 포맷 변환**
        // 메시지를 GPT API가 이해할 수 있는 포맷으로 변환
        const formattedMessages = messages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant', // 사용자 메시지: 'user', GPT 메시지: 'assistant'
            content: msg.content, // 메시지 내용
        }));

        // 사용자 입력 메시지를 추가
        formattedMessages.push({ role: 'user', content });

        console.log('Sending formatted messages to GPT API:', formattedMessages); // GPT API 호출 전 로그
        logger.info('Sending messages to GPT API');

        // **Step 4: GPT API 호출**
        const gptResponse = await callGPTAPI(formattedMessages); // GPT 응답 받기
        console.log('GPT API response:', gptResponse); // GPT 응답 로그
        logger.info('GPT API response received');

        // **Step 5: GPT 응답 메시지 저장**
        const gptMessage = await addMessage(conversationId, 'gpt', gptResponse);
        console.log('GPT message saved:', gptMessage); // 저장된 GPT 메시지 로그
        logger.info(`GPT message saved: ${JSON.stringify(gptMessage)}`);

        // **Step 6: 사용자 메시지와 GPT 응답 반환**
        res.status(201).json([userMessage, gptMessage]); // 성공 응답
    } catch (error) {
        console.error('Error processing message:', error); // 에러 로그
        logger.error(`Error processing message: ${error.message}`);
        res.status(500).json({ error: 'Failed to process message' }); // 에러 응답
    }
});

module.exports = router;
