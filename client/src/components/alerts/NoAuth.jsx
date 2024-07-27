import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Box, Typography, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function AlertModal({ open, handleClose }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Oops...You have not logged in.
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Please, log in to your account to have access.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button onClick={handleClose}>Close</Button>
                    <Link to='/login' style={{ textDecoration: 'none' }}>
                        <Button>Login</Button>
                    </Link>
                </Box>
            </Box>
        </Modal>
    );
}

export default AlertModal;
