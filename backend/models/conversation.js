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

// 특정 대화 삭제
const deleteConversation = async (id) => {
    try {
        const query = 'DELETE FROM gpt.conversations WHERE id = $1';
        const result = await db.query(query, [id]); // db 객체를 사용하여 쿼리 실행
        console.log(`Deleted conversation ID: ${id}, Result: ${JSON.stringify(result)}`);
        return result;
    } catch (error) {
        console.error(`Error in deleteConversation: ${error.message}`);
        throw error; // 에러를 다시 던짐
    }
};

module.exports = {
    getAllConversations,
    getConversationById,
    createConversation,
    deleteConversation,
};
