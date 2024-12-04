import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

export default function ModalAddPost({ children, open, handleClose }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="responsive-dialog-title"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle
                    id="alert-dialog-title"
                    align="center"
                    variant="h4"
                    sx={{ m: 2, position: 'relative' }}
                >
                    New Post
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
            </Dialog>
        </>
    );
}
