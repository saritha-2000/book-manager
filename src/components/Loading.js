import React from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Loading = ({ message = 'Loading...' }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
                textAlign: 'center',
                position: 'relative',
            }}
        >
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">{message}</Typography>
            <Button
                variant="outlined"
                sx={{
                    mt: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                }}
                onClick={handleBack}
            >
                Back
            </Button>

        </Box>
    );
};

export default Loading;
