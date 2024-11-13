const pool = require('../config/db');

// Get all conversations
const getAllConversations = async () => {
    const query = 'SELECT * FROM gpt.conversations ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
};

// Get conversation by ID
const getConversationById = async (id) => {
    const query = 'SELECT * FROM gpt.conversations WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

// Create a new conversation
const createConversation = async (title, userId) => {
    const query = `
        INSERT INTO gpt.conversations (title, user_id, created_at)
        VALUES ($1, $2, NOW())
        RETURNING *`;
    const { rows } = await pool.query(query, [title, userId]);
    return rows[0];
};
// const createConversation = async (title, userId) => {
//     const query = `
//         INSERT INTO gpt.conversations (title, user_id, created_at)
//         VALUES ($1, $2, NOW())
//         RETURNING *`;
//     const { rows } = await pool.query(query, [title, userId]);
//     return rows[0];
// };


module.exports = {
    getAllConversations,
    getConversationById,
    createConversation,
};
