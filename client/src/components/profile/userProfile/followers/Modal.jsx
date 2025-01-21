import React from 'react';
import {
    IconButton,
    AppBar,
    Toolbar,
    Dialog,
    Slide,
    Typography
} from '@mui/material';
import Followers from './Followers'
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function FollowersModal({ open, onClose }) {

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
                        Followers
                    </Typography>
                </Toolbar>
            </AppBar>
            <Followers onClose={onClose}/>
        </Dialog>
    );
};