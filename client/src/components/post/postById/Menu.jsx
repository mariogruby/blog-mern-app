import React from 'react';
import userService from '../../../services/user'
import { Menu, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


export default function DropdownMenu({ anchorEl, handleMenuClose, handleEdit, handleDeletePost }) {
    return (
        <div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        handleEdit();
                        handleMenuClose();
                    }}
                >
                    <EditIcon fontSize="small" sx={{ marginRight: 2}} />
                    Edit
                </MenuItem>
                <MenuItem
                onClick={() => {
                    handleDeletePost()
                }}
                >
                    <DeleteForeverIcon fontSize='small' sx={{ marginRight: 2}} />
                    Delete
                </MenuItem>
            </Menu>
        </div>
    );
}
