import React, { useContext } from 'react';
import { ToastContainer, Bounce } from 'react-toastify';
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthContext } from './context/auth';
import CssBaseline from '@mui/material/CssBaseline';
import Post from './components/post/postById/Post';
import AppLayout from './components/layouts/AppLyt';
import AuthLayout from './components/auth/AuthLayout';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import HomePage from './pages/home/Home';
import SavedPage from './pages/saved/Saved';
import ProfilePage from './pages/profile/Profile';
import ProfileLayout from './components/profile/Layout';
import DmPage from './pages/dm/Dm';
import './App.css';
import ProtectedRoute from './components/protectedRoutes/index';
import 'react-toastify/dist/ReactToastify.css';  // Asegúrate de importar el CSS de react-toastify

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const { isLoggedIn, isLoading } = useContext(AuthContext);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppLayout>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<AuthLayout><Signup /></AuthLayout>} />
          <Route path='/login' element={<AuthLayout><Login /></AuthLayout>} />
          <Route path='/post/:postId' element={<Post />} />
          <Route path='/saved-posts' element={<SavedPage />} />
          <Route path='/dm' element={<DmPage/>} />
          <Route
            path='/:username' 
            element={
              <ProtectedRoute 
                isLoggedIn={isLoggedIn} 
                isLoading={isLoading}
                redirectTo="/login" 
                element={<ProfileLayout><ProfilePage /></ProfileLayout>} 
              />
            } 
          />
        </Routes>
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
