const express = require('express');

const {
    getAllConversations,
    getConversationById,
    createConversation,
    deleteConversation,
} = require('../models/conversation');

const logger = require('../utils/logger'); // 로깅 유틸리티

const router = express.Router(); // 라우터 생성

// **Get all conversations**
router.get('/', async (req, res) => {
    try {
        const conversations = await getAllConversations(); // 전체 대화 가져오기
        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// **Get conversation by ID**
router.get('/:id', async (req, res) => {
    try {
        const conversation = await getConversationById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        res.json(conversation);
    } catch (error) {
        console.error('Error fetching conversation by ID:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

// **Create a new conversation**
router.post('/', async (req, res) => {
    const { title, userId } = req.body;

    if (!title || !userId) {
        return res.status(400).json({ error: 'Title and userId are required' });
    }

    try {
        // const { title, userId } = req.body;
        const newConversation = await createConversation(title, userId); // 새로운 대화 생성
        res.status(201).json(newConversation);
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Failed to create conversation' });
    }
});

/**
 * DELETE /api/conversations/:id
 * 특정 ID를 가진 대화를 삭제하는 API 엔드포인트
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Incoming DELETE request for conversation ID: ${id}`);

    try {
        const result = await deleteConversation(id);
        if (!result) {
            console.log(`No conversation found with ID: ${id}`);
            return res.status(404).json({ error: 'Conversation not found' });
        }

        console.log(`Deleted conversation with ID: ${result.id}`);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error deleting conversation with ID ${id}: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});





module.exports = router;
