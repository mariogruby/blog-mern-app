import React from 'react';
import { ToastContainer, Bounce } from 'react-toastify';
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import Post from './components/post/postById/Post';
import AppLayout from './components/layouts/AppLyt';
import AuthLayout from './components/auth/AuthLayout';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import UpdatePassword from './components/auth/Update';
import HomePage from './pages/home/Home';
import SavedPage from './pages/saved/Saved';
import ProfilePage from './pages/profile/Profile';
import ProfileLayout from './components/profile/Layout';
import DmPage from './pages/dm/Dm';
import './App.css';
import ProtectedRoute from './components/protectedRoutes/index';
import PublicRoute from './components/protectedRoutes/PublicRoute';
import 'react-toastify/dist/ReactToastify.css';

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
          <Route
            path='/signup'
            element={
              <PublicRoute
                redirectTo="/"
                element={<AuthLayout><Signup /></AuthLayout>}
              />
            }
          />
          <Route
            path='/login'
            element={
              <PublicRoute
                redirectTo="/"
                element={<AuthLayout><Login /></AuthLayout>}
              />
            }
          />
          <Route
            path='/update-password'
            element={
              <ProtectedRoute
                redirectTo="/login"
                element={
                  <AuthLayout>
                    <UpdatePassword />
                  </AuthLayout>
                }
              />
            }
          />
          <Route
            path='/post/:postId'
            element={
              <ProtectedRoute
                redirectTo="/login"
                element={<Post />}
              />
            }
          />
          <Route
            path='/saved-posts'
            element={
              <ProtectedRoute
                redirectTo="/login"
                element={<SavedPage />}
              />
            }
          />
          <Route
            path='/dm'
            element={
              <ProtectedRoute
                redirectTo="/login"
                element={<DmPage />}
              />
            }
          />
          <Route
            path='/:username'
            element={
              <ProtectedRoute
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
