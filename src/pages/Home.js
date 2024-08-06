import React, { useState, useEffect } from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import Navbar from '../components/Navbar';
// import { useNavigate } from 'react-router-dom';
import BookList from '../features/Books/BookList';
import BookForm from '../components/BookForm';
import api from '../services/api';


function Home() {
    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState(null);
    // const navigate = useNavigate();

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

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" component="div">
                        Available Books
                    </Typography>
                    {user && (
                        <Button variant="contained" color="primary" onClick={handleOpenModal}>
                            Add New Book
                        </Button>
                    )}
                </Box>
                <BookList />
            </Container>
            <BookForm open={openModal} handleClose={handleCloseModal} />
        </>
    );
}

export default Home;
