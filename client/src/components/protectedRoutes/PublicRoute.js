import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';

function PublicRoute({ element, redirectTo }) {
    const { isLoggedIn } = useContext(AuthContext);

    return isLoggedIn ? <Navigate to={redirectTo} /> : element;
}

export default PublicRoute;
