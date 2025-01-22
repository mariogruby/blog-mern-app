import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function AuthLayout({ children }) {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    const location = useLocation();
    const navigate = useNavigate();

    const getTitle = () => {
        switch (location.pathname) {
            case '/signup':
                return 'Create an account';
            case '/login':
                return 'Login';
            case '/update-password':
                return 'Update password';
            default:
                return 'Default title';
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={null}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <IconButton
                    aria-label="close"
                    onClick={() => {
                        if (handleClose) handleClose();
                        navigate('/');
                    }}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{ mt: 5 }}
                    justifyContent="center"
                    alignItems="center"
                    variant="h4"
                    display="flex"
                >
                    {getTitle()}
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
            </Dialog>
        </>
    );
}
