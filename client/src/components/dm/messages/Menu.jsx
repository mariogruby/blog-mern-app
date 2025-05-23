import React, { useContext } from 'react';
import { AuthContext } from '../../../context/auth';
import {
    Menu,
    MenuItem
} from '@mui/material';
import {
    Delete as DeleteIcon
} from '@mui/icons-material'

export default function MoreOptions({ anchorEl, handleMenuClose, deleteChatHandler }) {
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
                {!isLoggedIn ? (
                    null
                ) : (
                    <div>
                        <MenuItem onClick={() => {deleteChatHandler()}}>
                            <DeleteIcon
                                fontSize='small'
                                sx={{ marginRight: 2 }} />
                            Delete Chat
                        </MenuItem>
                    </div>
                )}
            </Menu>
        </div>
    );
}
