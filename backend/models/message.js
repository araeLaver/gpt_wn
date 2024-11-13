const pool = require('../config/db');

// Get all messages for a conversation
const getMessagesByConversationId = async (conversationId) => {
    const query = `
        SELECT * FROM gpt.messages
        WHERE conversation_id = $1
        ORDER BY timestamp ASC`;
    const { rows } = await pool.query(query, [conversationId]);
    return rows;
};

// Add a new message
const addMessage = async (conversationId, sender, content) => {
    const query = `
        INSERT INTO gpt.messages (conversation_id, sender, content, timestamp)
        VALUES ($1, $2, $3, NOW())
        RETURNING *`;
    const { rows } = await pool.query(query, [conversationId, sender, content]);
    return rows[0];
};

module.exports = {
    getMessagesByConversationId,
    addMessage,
};
