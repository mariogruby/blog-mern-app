import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/auth';
import {
    Menu,
    MenuItem
} from '@mui/material';
import {
    Logout as LogoutIcon,
    Password as PasswordIcon
} from '@mui/icons-material';

export default function MoreOptions({ anchorEl, handleMenuClose, logOutHandler }) {

    const { isLoggedIn } = useContext(AuthContext);
    return (
        <div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {isLoggedIn ? (
                    <div>
                        <MenuItem component={Link} to={'/update-password'}>
                            <PasswordIcon
                                fontSize='small'
                                sx={{ marginRight: 2 }} />
                            Edit Password
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            logOutHandler();
                        }}>
                            <LogoutIcon
                                fontSize='small'
                                sx={{ marginRight: 2 }} />
                            Logout
                        </MenuItem>
                    </div>
                ) : null}
            </Menu>
        </div>
    );
}
