import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        background: { default: '#121212', paper: '#1e1e1e' },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
    },
});

const theme = createTheme({
    palette: {
        mode: 'dark', // 다크 모드
        primary: {
            main: '#1976d2', // 기본 파란색
        },
        secondary: {
            main: '#f50057', // 강조 핑크색
        },
        background: {
            default: '#121212', // 다크 모드 배경
            paper: '#1e1e1e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // 기본 글꼴
        fontSize: 14,
    },
});


export { lightTheme, darkTheme, theme };
