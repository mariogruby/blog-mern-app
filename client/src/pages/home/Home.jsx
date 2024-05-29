import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/auth'
import { Button } from '@mui/material'

export default function Home() {
    const { logOutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    function logOutHandler() {
        logOutUser();
        navigate("/login");
    };

    return (
        <>
            <Button onClick={logOutHandler}>
                Logout
            </Button>
        </>
    )
}
