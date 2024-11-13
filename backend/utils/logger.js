const winston = require('winston');

// Logger 설정
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // 콘솔 로그 출력
        new winston.transports.File({ filename: 'server.log' }), // 파일 로그 저장
    ],
});

module.exports = logger;
