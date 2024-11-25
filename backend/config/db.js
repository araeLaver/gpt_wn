const { Pool } = require('pg'); // PostgreSQL 연결 풀
require('dotenv').config(); // .env 파일에서 환경 변수 로드

// 데이터베이스 연결 풀 설정
const db = new Pool({
    host: process.env.DATABASE_HOST, // 데이터베이스 호스트 주소
    user: process.env.DATABASE_USER, // 데이터베이스 사용자 이름
    password: process.env.DATABASE_PASSWORD, // 데이터베이스 비밀번호
    database: process.env.DATABASE_NAME, // 데이터베이스 이름
    port: process.env.DATABASE_PORT || 5432, // 포트 번호 (기본값: 5432)
    ssl: { rejectUnauthorized: false }, // SSL 인증 무시 (Koyeb 같은 환경에서 필요)
});

// 연결 성공 여부 확인
db.on('connect', () => {
    console.log('Connected to the database');
});

// 연결 에러 처리
db.on('error', (err) => {
    console.error('Unexpected error on idle client:', err.message);
    process.exit(-1);
});

// 데이터베이스 연결 테스트
(async () => {
    try {
        const result = await db.query(
            `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'gpt'`
        );
        console.log('Tables:', result.rows); // 테이블 목록 출력
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
})();

// deleteConversation 테스트 함수
(async () => {
    const deleteConversation = async (id) => {
        try {
            console.log(`Attempting to delete conversation with ID: ${id}`);
            const result = await db.query(
                `DELETE FROM gpt.conversations WHERE id = $1 RETURNING id`,
                [id]
            );
            if (result.rowCount === 0) {
                console.log(`No conversation found with ID: ${id}`);
                return null;
            }
            console.log(`Deleted conversation with ID: ${id}`);
            return result.rows[0];
        } catch (error) {
            console.error(`Error in deleteConversation: ${error.message}`);
            throw error;
        }
    };

    try {
        const result = await deleteConversation(18);
        console.log('Deleted conversation:', result);
    } catch (error) {
        console.error('Error deleting conversation:', error.message);
    }
})();

(async () => {
    try {
        const testQuery = await db.query('SELECT NOW()');
        console.log('Database connection test successful:', testQuery.rows[0]);
    } catch (error) {
        console.error('Database connection test failed:', error.message);
    }
})();

module.exports = db; // `db` 객체를 다른 모듈에서 사용할 수 있도록 export
