const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
require('dotenv').config();

const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const path = require('path');
const app = express();
// app.use(cors());

// 백엔드에서 CORS 설정을 추가하여 프론트엔드 도메인을 허용
// app.use(cors({
//     origin: '*', // 특정 프론트엔드 URL로 제한 가능 (예: 'https://<프론트엔드-URL>')
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));

// CORS 설정
app.use(cors());

// JSON 요청 처리
app.use(express.json());

// React 빌드 파일 제공
app.use(express.static(path.join(__dirname, '../frontend/build')));


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

// API 라우트
app.use('/api/conversations', require('./routes/conversationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));


// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API 라우트
app.use('/api/conversations', require('./routes/conversationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// React 애플리케이션의 나머지 경로 처리
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// // 모든 경로를 React 앱으로 전달
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// });

// local
//const PORT = process.env.PORT || 5001;

//koyeb
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("@Start !!@");
    console.log(`Server is running on port ${PORT}`);
});
