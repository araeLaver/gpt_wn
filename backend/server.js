const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
require('dotenv').config();

const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// 타임스탬프 로그 헬퍼 함수
const logWithTimestamp = (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
};

// 서버 시작 로그
logWithTimestamp('Server starting...');


// 로깅 미들웨어
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    res.on('finish', () => {
        logger.info(`Response status: ${res.statusCode}`);
    });
    next();
});

app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log("@Start !!@");
    console.log(`Server is running on port ${PORT}`);
});
