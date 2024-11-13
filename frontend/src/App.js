// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, IconButton } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import MainPage from './components/MainPage';
import DetailPage from './components/DetailPage';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const App = () => {
    const [darkMode, setDarkMode] = useState(true);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Router>
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <IconButton onClick={toggleDarkMode} color="inherit">
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </div>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/conversation/:id" element={<DetailPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;


