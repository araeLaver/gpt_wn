const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // SSL 인증서 검증 비활성화
    },
});

module.exports = pool;
