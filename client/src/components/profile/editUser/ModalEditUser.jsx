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

//TODO: pending clean code 
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
                    Edit User
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
            </Dialog>
        </>
    )
}
