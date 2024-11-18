const express = require('express');

const {
    getAllConversations,
    getConversationById,
    createConversation,
    deleteConversation,
} = require('../models/conversation');

const router = express.Router();

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

// 대화 삭제
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Deleting conversation with ID: ${id}`); // 요청 로그

        const result = await deleteConversation(id); // 삭제 함수 호출
        console.log(`Delete result: ${JSON.stringify(result)}`);

        if (result.rowCount === 0) {
            console.warn(`Conversation ID ${id} not found`);
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Error deleting conversation:', error.message);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
});



module.exports = router;
