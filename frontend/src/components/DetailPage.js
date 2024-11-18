import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    Box, 
    TextField, 
    Button, 
    List,
    ListItem, 
    Paper, 
    IconButton 
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const DetailPage = () => {
    const { id: conversationId } = useParams(); // URL에서 대화 ID 가져오기
    const [messages, setMessages] = useState([]); // 대화 내역
    const [newMessage, setNewMessage] = useState(''); // 새로운 메시지 입력

    // local
    // const API_URL = 'http://localhost:5001/';
    // koyeb
    const API_URL = process.env.REACT_APP_API_URL;
    // 대화 내역 가져오기
    const fetchMessages = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/api/messages/${conversationId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [conversationId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // 새로운 메시지 전송
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post('${API_URL}/api/messages', {
                conversationId,
                sender: 'user',
                content: newMessage,
            });

            setMessages((prev) => [...prev, ...response.data]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setNewMessage('');
        }
    };

    // 엔터키로 전송
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // 코드 복사 기능
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert('Code copied to clipboard!'))
            .catch(() => alert('Failed to copy code.'));
    };

    // 코드인지 확인
    const isCode = (text) => {
        // 간단한 코드 판별 예: JSON, JavaScript, Python 코드 패턴 포함 여부
        return text.startsWith('{') || text.startsWith('function') || text.includes('def ') || text.includes('import ');
    };

    return (
        <Box padding={2}>
            {/* 대화 내역 */}
            <List>
                {messages.map((message) => (
                    <ListItem 
                        key={message.id} 
                        sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
                    >
                        <Paper
                            sx={{
                                padding: 2,
                                backgroundColor: message.sender === 'user' ? '#2c3e50' : '#34495e', // 어두운 색상
                                color: '#ecf0f1', // 밝은 텍스트
                                borderRadius: 2,
                                maxWidth: '80%',
                                position: 'relative',
                                overflowX: 'auto', // 긴 코드 스크롤 허용
                            }}
                        >
                            {isCode(message.content) ? (
                                // 개발 소스 스타일
                                <Box
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                        fontFamily: 'monospace', // 코드 스타일
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                        backgroundColor: '#1c2833', // 코드 블록 배경
                                        padding: 1,
                                        borderRadius: 1,
                                        color: '#f7f9f9', // 코드 글자 색
                                    }}
                                >
                                    {message.content}
                                </Box>
                            ) : (
                                // 일반 텍스트 스타일
                                <Box
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                        fontFamily: 'inherit',
                                        fontSize: '1rem',
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {message.content}
                                </Box>
                            )}
                            {message.sender === 'gpt' && isCode(message.content) && (
                                <IconButton
                                    size="small"
                                    onClick={() => handleCopy(message.content)}
                                    sx={{
                                        position: 'absolute',
                                        top: 5,
                                        right: 5,
                                    }}
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Paper>
                    </ListItem>
                ))}
            </List>

            {/* 메시지 입력 */}
            <Box display="flex" mt={2}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your message... (Shift + Enter for line break)"
                    multiline
                />
                <Button variant="contained" onClick={handleSendMessage} sx={{ marginLeft: 2 }}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default DetailPage;
