import React from 'react'
import Button from '@mui/material/Button'

export default function BtnPrimary(props) {
    return (
        <Button {...props}>
            {props.children}
        </Button>
    )
}
