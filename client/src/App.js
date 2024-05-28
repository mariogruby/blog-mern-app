import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import AppLayout from './components/layouts/AppLyt'
import AuthLayout from './components/auth/AuthLayout'
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'
import HomePage from './pages/home/Home'
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
        </Routes>
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
