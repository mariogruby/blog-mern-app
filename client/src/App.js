import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import Post from './components/post/postById/Post'
import AppLayout from './components/layouts/AppLyt'
import AuthLayout from './components/auth/AuthLayout'
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'
import HomePage from './pages/home/Home'
import SavedPage from './pages/saved/Saved'
import './App.css';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppLayout>
        <Routes>
          <Route
            path='/'
            element={<HomePage />}
          />
          <Route
            path='/signup'
            element={<AuthLayout><Signup /></AuthLayout>}
          />
          <Route
            path='/login'
            element={<AuthLayout><Login /></AuthLayout>}
          />
          <Route
            path='/post/:postId'
            element={<Post />}
          />
          <Route
            path='/saved-posts'
            element={<SavedPage />}
          />
        </Routes>
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
