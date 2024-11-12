import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@mui/material'

//? re design modal ???

export default function ModalAddPost({ children, open, handleClose }) {
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title"
                    align="center"
                    variant="h4"
                    sx={{ m: 2 }}>
                    New Post
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
            </Dialog>
        </>
    )
}
