import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Paper,
    Button
} from '@mui/material';
import Navbar from './Navbar';
import { fetchBookDetails } from '../services/api';
import api from '../services/api';
import Loading from './Loading';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [isbnData, setIsbnData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // get book details by id
    useEffect(() => {
        const getBookDetails = async () => {
            try {
                const response = await api.get(`/books/${id}`);
                setBook(response.data);
                if (response.data.isbn) {
                    const isbnDetails = await fetchBookDetails(response.data.isbn);
                    setIsbnData(isbnDetails);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getBookDetails();
    }, [id]);

    if (loading) return <Loading />;
    if (error) return <Typography variant="h6" color="error">Error: {error.message}</Typography>;
    if (!book) return <Typography variant="h6">No book found.</Typography>;

    const {
        title,
        author,
        publicationYear,
        isbn
    } = book;

    const isbnInfo = isbnData || {};

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                        Back to Home
                    </Button>
                    <Grid container spacing={4}>
                        {/* book cover */}
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    image={isbnInfo.cover?.medium || 'https://via.placeholder.com/150'}
                                    alt={isbnInfo.title || title}
                                    sx={{ height: 350 }}
                                />
                            </Card>
                        </Grid>
                        {/* book details */}
                        <Grid item xs={12} sm={8}>
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    {isbnInfo.title || title}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                    {isbnInfo.authors?.map(author => author.name).join(', ') || author}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" paragraph>
                                    {isbnInfo.subjects?.map(subject => subject.name).join(', ')}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {isbnInfo.excerpts ? isbnInfo.excerpts[0]?.text : 'No description available.'}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Published Year:</strong> {isbnInfo.publish_date || publicationYear}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Publisher:</strong> {isbnInfo.publishers?.map(publisher => publisher.name).join(', ')}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Page Count:</strong> {isbnInfo.number_of_pages}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>ISBN:</strong> {isbn}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
};

export default BookDetails;
