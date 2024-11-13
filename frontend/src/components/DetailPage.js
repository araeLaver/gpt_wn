import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, List, ListItem, Paper } from '@mui/material';

const DetailPage = () => {
    const { id: conversationId } = useParams(); // URL에서 대화 ID 가져오기
    const [messages, setMessages] = useState([]); // 대화 내역
    const [newMessage, setNewMessage] = useState(''); // 새로운 메시지 입력

    // 대화 내역 가져오기
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/messages/${conversationId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // 페이지 로드 시 대화 내역 가져오기
    useEffect(() => {
        fetchMessages();
    }, [conversationId]);

    // 새로운 메시지 전송
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            // 메시지 전송 및 GPT API 호출
            const response = await axios.post('http://localhost:5001/api/messages', {
                conversationId,
                sender: 'user',
                content: newMessage,
            });

            // 새로운 메시지와 GPT 응답 추가
            setMessages((prev) => [...prev, ...response.data]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setNewMessage(''); // 입력 필드 초기화
        }
    };

    return (
        <Box padding={2}>
            {/* 대화 내역 */}
            <List>
                {messages.map((message) => (
                    <ListItem key={message.id} sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                        <Paper
                            sx={{
                                padding: 2,
                                backgroundColor: message.sender === 'user' ? '#1976d2' : '#e0e0e0',
                                color: message.sender === 'user' ? '#fff' : '#000',
                                borderRadius: 2,
                                maxWidth: '60%',
                            }}
                        >
                            {message.content}
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
                />
                <Button variant="contained" onClick={handleSendMessage} sx={{ marginLeft: 2 }}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default DetailPage;
