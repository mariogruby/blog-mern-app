import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';

function ProtectedRoute({ element, redirectTo }) {
    const { isLoggedIn, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>Loading...</div>; 
    }

    return isLoggedIn ? element : <Navigate to={redirectTo} />;
}

export default ProtectedRoute;
