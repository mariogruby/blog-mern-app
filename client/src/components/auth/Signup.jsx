import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import authService from "../../services/auth"
import LoaderPrimary from '../loadings/LoaderPrimary'
import BtnPrimary from '../buttons/BtnPrimary'
import {
    Box,
    TextField,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    InputAdornment
} from '@mui/material'
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'

//TODO: mensajes de errores especificos

export default function Signup() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);

    const navigate = useNavigate();

    const handleClickShowNewPassword = () => setShowNewPassword((prev) => !prev);

    const handleEmail = (e) => {
        setEmail(e.target.value);
        if (errorMessage && errorMessage.includes('address')) {
            setErrorMessage(undefined);
            setIsLoading(false);
        }
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
        if (errorMessage && errorMessage.includes('Password')) {
            setErrorMessage(undefined);
            setIsLoading(false);
        }
    };

    const handleUsername = (e) => {
        setUsername(e.target.value);
        if (errorMessage && errorMessage.includes('Username')) {
            setErrorMessage(undefined);
            setIsLoading(false);
        }
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)

        const requestBody = { email, password, username };
        authService.signup(requestBody)
            .then((response) => {
                // setIsLoading(true);
                toast.success('Account created');
                navigate("/login");
            })
            .catch((error) => {
                const errorDescription = error.response.data.message;
                setErrorMessage(errorDescription);
                toast.error(errorDescription)
                setIsLoading(false);
            });
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <Box
                    component="form"
                    onSubmit={handleSignupSubmit}
                    noValidate
                    autoComplete="off"
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                error={errorMessage}
                                fullWidth
                                required
                                value={username}
                                onChange={handleUsername}
                                margin="dense"
                                name="username"
                                label="Username"
                                type="text"
                                variant="outlined"
                                helperText={errorMessage && (errorMessage.includes('Account')) ? errorMessage : null}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={errorMessage}
                                fullWidth
                                required
                                value={email}
                                onChange={handleEmail}
                                margin="dense"
                                name="email"
                                label="Email Address"
                                type="email"
                                variant="outlined"
                                helperText={errorMessage && (errorMessage.includes('valid')) ? errorMessage : null}
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
                                error={errorMessage}
                                fullWidth
                                required
                                value={password}
                                onChange={handlePassword}
                                margin="dense"
                                name="password"
                                label="Password"
                                variant="outlined"
                                helperText={errorMessage && (errorMessage.includes('characters')) ? errorMessage : null}
                            />
                        </Grid>
                    </Grid>
                    <Box
                        sx={{ mt: 5, mb: 3 }}
                        display="flex"
                        justifyContent="center"
                        alignItems="center">
                        {isLoading ?
                            <BtnPrimary disabled><LoaderPrimary /></BtnPrimary>
                            :
                            <BtnPrimary type="submit">Signup</BtnPrimary>}
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center">
                        <Typography variant="body1" color="textPrimary">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login" color="primary" underline="hover">
                                Log in
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </>

    )
}
