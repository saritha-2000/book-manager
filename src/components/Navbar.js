import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api, { logout } from '../services/api';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // get user data from session
    useEffect(() => {
        api.get('/user/user-details')
            .then(response => {
                console.log('User Details:', response);
                const data = response.data;
                if (data.id) {
                    setUser(data);
                    localStorage.setItem('user', JSON.stringify(data));
                }
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                localStorage.removeItem('user');
            });
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        window.location.reload(true);
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Book Management
                </Typography>
                {user ? (
                    <>
                        <Typography variant="body1" component="div" sx={{ marginRight: 2 }}>
                            Hello, {user.displayName || user.email}!
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button color="inherit" onClick={handleLogin}>
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
