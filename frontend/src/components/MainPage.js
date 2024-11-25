import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    // CardActionArea,
    TextField,
    Button,
} from '@mui/material';

import { useCallback } from 'react';

const MainPage = () => {
    const [conversations, setConversations] = useState([]); // 히스토리 데이터
    const [newMessage, setNewMessage] = useState(''); // 새 메시지 입력
    const [loading, setLoading] = useState(false); // 로딩 상태
    const navigate = useNavigate();

    // local
    // const API_URL = 'http://localhost:5001/';
    // koyeb
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

    // 히스토리 데이터를 API에서 가져오기
    const fetchConversations = useCallback(async () => {
        console.log('API_URL:', API_URL);
        try {
            const response = await axios.get(`${API_URL}/api/conversations`);
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    }, [API_URL]); // API_URL을 의존성으로 추가

    // 대화 삭제 요청
    const handleDelete = async (id) => {
        try {
            console.log(`Attempting to delete conversation with ID: ${id}`);
            const response = await axios.delete(`${API_URL}/api/conversations/${id}`);
            console.log(`Deleted conversation:`, response.data);
    
            setConversations((prev) => prev.filter((conv) => conv.id !== id));
        } catch (error) {
            console.error(`Error deleting conversation with ID ${id}:`, error.response?.data || error.message);
        }
    };

    // 페이지 로드 시 히스토리 데이터를 가져옴
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]); // useCallback으로 감싸진 함수는 의존성 배열에 안전하게 추가 가능

    // 새로운 대화 시작 및 GPT 호출
    const handleStartChat = async () => {
        if (!newMessage.trim()) return; // 빈 메시지 방지

        setLoading(true); // 로딩 시작

        try {
            // 1. 새로운 대화 생성
            const conversationResponse = await axios.post(`${API_URL}/api/conversations`, {
                title: newMessage, // 첫 메시지를 타이틀로 사용
                userId: 1, // 예시 사용자 ID
            });
            const conversationId = conversationResponse.data.id;

            // 2. 첫 메시지와 함께 GPT API 호출
            await axios.post(`${API_URL}/api/messages`, {
                conversationId,
                sender: 'user',
                content: newMessage,
            });

            // 3. 상세 페이지로 이동
            navigate(`/conversation/${conversationId}`);
        } catch (error) {
            console.error('Error starting chat:', error);
        } finally {
            setLoading(false); // 로딩 종료
            setNewMessage(''); // 입력 필드 초기화
        }
    };

    return (
        <Box padding={2}>
            {/* 로딩 상태 표시 */}
            {loading && (
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    sx={{ transform: 'translate(-50%, -50%)', textAlign: 'center' }}
                >
                    <Typography variant="h6" color="primary">
                        Creating conversation...
                    </Typography>
                </Box>
            )}

            {/* 채팅 입력 영역 */}
            <Box display="flex" alignItems="center" marginBottom={3}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Enter your message to start chatting"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={loading} // 로딩 중 입력 비활성화
                />
                <Button
                    variant="contained"
                    onClick={handleStartChat}
                    sx={{ marginLeft: 2 }}
                    disabled={loading} // 로딩 중 버튼 비활성화
                >
                    Chat
                </Button>
            </Box>

            {/* 기존 대화 목록 */}
            <Grid container spacing={3}>
                {conversations.map((conversation) => (
                    <Grid item xs={12} sm={6} md={4} key={conversation.id}>
                        <Card onClick={() => navigate(`/conversation/${conversation.id}`)} sx={{ cursor: 'pointer' }}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {conversation.title || 'Untitled'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {new Date(conversation.created_at).toLocaleString()}
                                    </Typography>
                                </CardContent>
                                <Box display="flex" justifyContent="flex-end" padding={1}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Card 클릭 이벤트와 중첩되지 않도록 방지
                                            handleDelete(conversation.id);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                        </Card>

                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MainPage;



// <Card>
// <CardActionArea onClick={() => navigate(`/conversation/${conversation.id}`)}>
//     <CardContent>
//         <Typography variant="h6">
//             {conversation.title || 'Untitled'}
//         </Typography>
//         <Typography variant="body2" color="textSecondary">
//             {new Date(conversation.created_at).toLocaleString()}
//         </Typography>
//         <Box display="flex" justifyContent="space-between" marginTop={2}>
//             {/* <Button
//                 variant="outlined"
//                 color="primary"
//                 onClick={() => navigate(`/conversation/${conversation.id}`)}
//             >
//                 Open
//             </Button> */}
//             <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={() => handleDelete(conversation.id)}
//             >
//                 Delete
//             </Button>
//         </Box>
//     </CardContent>
// </CardActionArea>
// </Card>