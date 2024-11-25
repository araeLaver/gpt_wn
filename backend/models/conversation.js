// 데이터베이스 연결 객체 가져오기
const db = require('../config/db');

// Get all conversations
const getAllConversations = async () => {
    const query = 'SELECT * FROM gpt.conversations ORDER BY created_at DESC';
    const { rows } = await db.query(query);
    return rows;
};

// Get conversation by ID
const getConversationById = async (id) => {
    const query = 'SELECT * FROM gpt.conversations WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

// Create a new conversation
const createConversation = async (title, userId) => {
    const query = `
        INSERT INTO gpt.conversations (title, user_id, created_at)
        VALUES ($1, $2, NOW())
        RETURNING *`;
    const { rows } = await db.query(query, [title, userId]);
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


const deleteConversation = async (id) => {
    try {
        console.log(`Attempting to delete conversation with ID: ${id}`);
        
        // 쿼리 실행 전 데이터베이스 상태 출력
        const checkQuery = 'SELECT * FROM gpt.conversations WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);
        console.log('Conversation before delete:', checkResult.rows);
        
        if (checkResult.rowCount === 0) {
            console.log(`No conversation found with ID: ${id}`);
            return null;
        }

        // DELETE 쿼리 실행
        const result = await db.query(
            `DELETE FROM gpt.conversations WHERE id = $1 RETURNING id`,
            [id]
        );

        // 삭제 결과 확인
        if (result.rowCount === 0) {
            console.log(`No conversation found with ID: ${id}`);
            return null;
        }

        console.log(`Successfully deleted conversation with ID: ${id}`);
        return result.rows[0];
    } catch (error) {
        console.error(`Error in deleteConversation: ${error.message}`);
        throw error;
    }
};


module.exports = {
    getAllConversations,
    getConversationById,
    createConversation,
    deleteConversation,
};
