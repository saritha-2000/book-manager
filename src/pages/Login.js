import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { loginWithGoogle } from '../services/api';

function Login() {
    return (
        <Container
            maxWidth="sm"
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    padding: 4, 
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Please sign in using your Google account
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<GoogleIcon />}
                    onClick={loginWithGoogle}
                    sx={{ mt: 3 }}
                >
                    Login with Google
                </Button>
            </Box>
        </Container>
    );
}

export default Login;
