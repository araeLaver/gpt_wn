const winston = require('winston'); // 로깅 라이브러리

// 로그 포맷 설정
const logFormat = winston.format.combine(
    winston.format.timestamp(), // 타임스탬프 추가
    winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`; // 로그 메시지 포맷
    })
);

// 로거 생성
const logger = winston.createLogger({
    level: 'info', // 기본 로그 레벨
    format: logFormat, // 로그 포맷
    transports: [
        new winston.transports.Console(), // 콘솔 출력
        new winston.transports.File({ filename: 'server.log' }), // 파일 저장
    ],
});

module.exports = logger; // 로거 내보내기
