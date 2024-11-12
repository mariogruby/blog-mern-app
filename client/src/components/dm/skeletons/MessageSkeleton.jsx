import React from 'react'
import {
    Box,
    Paper,
    Skeleton
} from '@mui/material';

export default function MessageSkeleton() {
    return (
        <Box flex={1} padding="16px" height={450}>
            <Box display="flex" flexDirection="column" gap="8px">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Box key={index} display="flex" justifyContent={index % 2 === 0 ? 'flex-end' : 'flex-start'}>
                        <Paper
                            elevation={1}
                            sx={{
                                padding: '12px',
                                backgroundColor: index % 2 === 0 ? '#3f51b5' : '#e0e0e0',
                                color: index % 2 === 0 ? 'white' : '#000',
                                borderRadius: '16px',
                                maxWidth: '75%'
                            }}
                        >
                            <Skeleton
                                variant="text"
                                width={index % 2 === 0 ? '100%' : '80%'}
                                animation="wave"
                                sx={{ marginBottom: '4px' }}
                            />
                            <Skeleton variant="text" width="200px" animation="wave" />
                        </Paper>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}
