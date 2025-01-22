import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import BtnPrimary from '../buttons/BtnPrimary';
import authService from '../../services/auth';
import LoaderPrimary from '../loadings/LoaderPrimary';
import {
    Box,
    TextField,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    InputAdornment
} from '@mui/material';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const { storeToken, authenticateUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleClickShowNewPassword = () => setShowNewPassword((prev) => !prev);

    const handleIdentifier = (e) => {
        setIdentifier(e.target.value);
        if (errorMessage && (errorMessage.includes('found') || errorMessage.includes('Provide'))) {
            setErrorMessage(undefined);
            setIsLoading(false);
        }
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
        if (errorMessage && (errorMessage.includes('Unable') || errorMessage.includes('Provide'))) {
            setErrorMessage(undefined);
            setIsLoading(false);
        }
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const requestBody = { identifier, password };
        setIsLoading(true);

        authService.login(requestBody)
            .then((response) => {
                storeToken(response.data.authToken);
                authenticateUser();
                navigate("/");
            })
            .catch((error) => {
                const errorDescription = error.response?.data?.message || "Something went wrong.";
                setErrorMessage(errorDescription);
                setIsLoading(false);
                toast.error(errorDescription);
            });
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <Box
                    component="form"
                    onSubmit={handleLoginSubmit}
                    noValidate
                    autoComplete="off"
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                error={!!errorMessage}
                                fullWidth
                                required
                                value={identifier}
                                onChange={handleIdentifier}
                                margin="dense"
                                name="identifier"
                                label="Email or Username"
                                type="text"
                                variant="outlined"
                                helperText={
                                    errorMessage &&
                                        (errorMessage.includes('found') || errorMessage.includes('Provide') || errorMessage.includes('spaces'))
                                        ? errorMessage
                                        : null
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type={showNewPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showNewPassword ? 'Hide password' : 'Show password'
                                                }
                                                onClick={handleClickShowNewPassword}
                                            >
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!errorMessage}
                                fullWidth
                                required
                                value={password}
                                onChange={handlePassword}
                                margin="dense"
                                name="password"
                                label="Password"
                                variant="outlined"
                                helperText={
                                    errorMessage && (errorMessage.includes('Unable') || errorMessage.includes('Provide'))
                                        ? errorMessage
                                        : null
                                }
                            />
                        </Grid>
                    </Grid>
                    <Box
                        sx={{ mt: 5, mb: 3 }}
                        display="flex"
                        justifyContent="center"
                        alignItems="center">
                        {isLoading ? (
                            <BtnPrimary disabled><LoaderPrimary /></BtnPrimary>
                        ) : (
                            <BtnPrimary type="submit">Login</BtnPrimary>
                        )}
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center">
                        <Typography variant="body1" color="textPrimary">
                            Don’t have an account?{' '}
                            <Link component={RouterLink} to="/signup" color="primary" underline="hover">
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
