import React from 'react';
import Notifications from './Notifications'
import {
    IconButton,
    AppBar,
    Toolbar,
    Dialog,
    Slide,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function NotificationsModal({ open, onClose }) {

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
                        Notifications
                    </Typography>
                </Toolbar>
            </AppBar>
            <Notifications onClose={onClose} />
        </Dialog>
    );
};


// import React from 'react';
// import { useNotificationsActions } from './Actions';
// import { IconButton, Divider, AppBar, Toolbar, Dialog, List, ListItem, ListItemText, ListItemButton, Slide, Avatar, Typography, Box } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="down" ref={ref} {...props} />;
// });

// export default function NotificationsModal({ open, onClose }) {
//     const { notifications, errorMessage, isLoading } = useNotificationsActions();

//     return (
//         <Dialog
//             fullScreen
//             open={open}
//             onClose={onClose}
//             TransitionComponent={Transition}
//         >
//             <AppBar sx={{ position: 'relative' }}>
//                 <Toolbar>
//                     <IconButton
//                         edge="start"
//                         color="inherit"
//                         onClick={onClose}
//                         aria-label="close"
//                     >
//                         <CloseIcon />
//                     </IconButton>
//                     <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
//                         Notifications
//                     </Typography>
//                 </Toolbar>
//             </AppBar>

//             {isLoading && <Typography>Loading...</Typography>}
//             {errorMessage && <Typography color="error">{errorMessage}</Typography>}

//             <List>
//                 {notifications.map((notification) => (
//                     <>
//                         <ListItemButton key={notification._id}>
//                             <Avatar src={notification.user.userImage} alt="Post Image" sx={{ marginRight: 2 }} />
//                             <ListItemText
//                                 primary={<Typography variant="body1">
//                                     {notification.user.username} liked your post
//                                     {/* {notification.type}  */}
//                                 </Typography>}
//                             />
//                         </ListItemButton><Divider />
//                     </>
//                 ))}
//             </List>
//         </Dialog>
//     );
// }

