import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@mui/material'
// import Home from '../../components/post/AllPosts'

export default function AuthLayout({ children}) {
    const [open, setOpen] = useState(true);

    const handleClickOpen = () => {
        console.log("open:", open)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const location = useLocation();
    const getTitle = () => {
        switch (location.pathname) {
            case '/signup':
                return 'Create an account';
            case '/login':
                return 'Login'
            default:
                return 'Default title';
        }
    }
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    sx={{ mt: 5 }}
                    id="alert-dialog-title"
                    justifyContent="center"
                    alignItems="center"
                    variant="h4"
                    display="flex">
                    {getTitle()}
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
            </Dialog>
        </>
    )
}
