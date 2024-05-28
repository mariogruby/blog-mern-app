import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/auth'
import BtnPrimary from '../buttons/BtnPrimary'
import authService from '../../services/auth'
import LoaderPrimary from '../loadings/LoaderPrimary'
import {
    Box,
    TextField,
    Container,
    Grid,
    Typography,
    Link
} from '@mui/material'

//TODO: mensajes de errores especificos

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);
    const { storeToken, authenticateUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
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
        const requestBody = { email, password };
        setIsLoading(true)

        authService.login(requestBody)
            .then((response) => {
                // setIsLoading(true);
                storeToken(response.data.authToken);
                authenticateUser();
                navigate("/");
            })
            .catch((error) => {
                const errorDescription = error.response.data.message;
                setErrorMessage(errorDescription);
                setIsLoading(false)
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
                                fullWidth
                                required
                                value={email}
                                onChange={handleEmail}
                                margin="dense"
                                name="email"
                                label="Email"
                                type="text"
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                value={password}
                                onChange={handlePassword}
                                margin="dense"
                                name="password"
                                label="Password"
                                type="password"
                                variant="standard"
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
                            <BtnPrimary type="submit">Login</BtnPrimary>}
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center">
                        <Typography variant="body1" color="textPrimary">
                            Don´t have an account?{' '}
                            <Link component={RouterLink} to="/signup" color="primary" underline="hover">
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </>
    )
}
