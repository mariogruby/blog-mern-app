import React, { useState, useContext } from 'react';
import {
    Backdrop,
    CircularProgress,
} from '@mui/material'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';

function ProtectedRoute({ element, redirectTo }) {
    const { isLoggedIn, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <Backdrop
                open={true}
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    return isLoggedIn ? element : <Navigate to={redirectTo} />;
}

export default ProtectedRoute;
