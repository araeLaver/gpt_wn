// 기본 모듈 및 설정 파일 불러오기
const express = require('express'); // Express.js 모듈
const cors = require('cors'); // CORS(Cross-Origin Resource Sharing) 설정 모듈
const logger = require('./utils/logger'); // 커스텀 로깅 유틸리티
require('dotenv').config(); // .env 파일에 저장된 환경 변수 로드

// 라우터 파일 가져오기
const messageRoutes = require('./routes/messageRoutes'); // 메시지 관련 API 라우터
const conversationRoutes = require('./routes/conversationRoutes'); // 대화 관련 API 라우터

const path = require('path'); // 파일 및 디렉터리 경로 작업을 위한 모듈
const app = express(); // Express 앱 생성

// **CORS 설정**: 프론트엔드가 다른 도메인에서 API 호출할 수 있도록 허용
app.use(cors());

// **JSON 요청 파싱**: Express가 JSON 요청 본문을 자동으로 처리하도록 설정
app.use(express.json());

// **React 정적 파일 제공**: React에서 빌드된 `build` 디렉터리를 정적 파일로 제공
app.use(express.static(path.join(__dirname, '../frontend/build')));

// **환경 변수 확인**
// API URL 확인을 위한 로그
console.log('API_URL::::', process.env.API_URL);

// **타임스탬프 로그 헬퍼 함수**
const logWithTimestamp = (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
};

// **서버 시작 로그**
logWithTimestamp('Server starting...');

// **로깅 미들웨어**: 모든 요청과 응답 상태를 로깅
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`); // 요청 로그
    res.on('finish', () => {
        logger.info(`Response status: ${res.statusCode}`); // 응답 상태 로그
    });
    next();
});

// **API 라우트 설정**
// `/api/conversations` 경로로 들어오는 요청은 `conversationRoutes`로 처리
app.use('/api/conversations', conversationRoutes);

// `/api/messages` 경로로 들어오는 요청은 `messageRoutes`로 처리
app.use('/api/messages', messageRoutes);

// **React 애플리케이션 라우팅 처리**
// 나머지 모든 경로를 React의 `index.html` 파일로 전달
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// });

// React 애플리케이션의 나머지 경로 처리
app.get('*', (req, res) => {
    const reactIndexPath = path.join(__dirname, '../frontend/build/index.html');
    if (fs.existsSync(reactIndexPath)) {
        res.sendFile(reactIndexPath); // React 앱의 index.html 반환
    } else {
        res.status(404).send('React build files not found');
    }
});

// **서버 포트 설정**
// 환경 변수 `PORT`를 먼저 사용하고, 없으면 기본값으로 5001 사용 (로컬 실행용)
const PORT = process.env.PORT || 5001;

// **서버 실행**
app.listen(PORT, () => {
    console.log('@Start !!@');
    console.log(`Server is running on port ${PORT}`);
});



// const express = require('express');
// const cors = require('cors');
// const logger = require('./utils/logger');
// require('dotenv').config();

// const messageRoutes = require('./routes/messageRoutes');
// const conversationRoutes = require('./routes/conversationRoutes');
// const path = require('path');
// const app = express();
// // app.use(cors());

// // 백엔드에서 CORS 설정을 추가하여 프론트엔드 도메인을 허용
// // app.use(cors({
// //     origin: '*', // 특정 프론트엔드 URL로 제한 가능 (예: 'https://<프론트엔드-URL>')
// //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
// // }));

// // CORS 설정
// app.use(cors());

// // JSON 요청 처리
// app.use(express.json());

// // React 빌드 파일 제공
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// console.log('API_URL::::', process.env.API_URL);

// // 타임스탬프 로그 헬퍼 함수
// const logWithTimestamp = (message) => {
//     console.log(`[${new Date().toISOString()}] ${message}`);
// };

// // 서버 시작 로그
// logWithTimestamp('Server starting...');


// // 로깅 미들웨어
// app.use((req, res, next) => {
//     logger.info(`Incoming request: ${req.method} ${req.url}`);
//     res.on('finish', () => {
//         logger.info(`Response status: ${res.statusCode}`);
//     });
//     next();
// });

// // API 라우트
// app.use('/api/conversations', require('./routes/conversationRoutes'));
// app.use('/api/messages', require('./routes/messageRoutes'));


// // 정적 파일 제공
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// // API 라우트
// app.use('/api/conversations', require('./routes/conversationRoutes'));
// app.use('/api/messages', require('./routes/messageRoutes'));

// // React 애플리케이션의 나머지 경로 처리
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// });

// // // 모든 경로를 React 앱으로 전달
// // app.get('*', (req, res) => {
// //     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// // });

// // local
// const PORT = process.env.PORT || 5001;

// // 예제 라우팅
// app.get('/api/conversations', (req, res) => {
//     res.json({ message: 'Conversations fetched successfully' });
// });

// //koyeb
// // const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//     console.log("@Start !!@");
//     console.log(`Server is running on port ${PORT}`);
// });
