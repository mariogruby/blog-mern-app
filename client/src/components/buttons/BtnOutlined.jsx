import React from 'react'
import Button from '@mui/material/Button'

export default function BtnOutlined(props) {
    return (
        <Button
            {...props}
            variant="outlined">
            {props.children}
        </Button>
    )
}
