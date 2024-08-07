import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addBook, updateBook } from '../features/Books/booksSlice';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const AddNewBookModal = ({ open, handleClose, book, isEditMode }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [isbn, setIsbn] = useState('');
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

    // dinamically set values for the fields
    useEffect(() => {
        if (isEditMode && book) {
            setTitle(book.title);
            setAuthor(book.author);
            setYear(book.publicationYear.toString());
            setIsbn(book.isbn);
        } else {
            resetForm();
        }
    }, [isEditMode, book]);

    const resetForm = () => {
        setTitle('');
        setAuthor('');
        setYear('');
        setIsbn('');
        setErrors({});
    };

    // form validation
    const validate = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (!author) newErrors.author = 'Author is required';
        if (!year) {
            newErrors.year = 'Publication Year is required';
        } else if (!/^\d{4}$/.test(year)) {
            newErrors.year = 'Enter a valid year';
        } else if (parseInt(year) > new Date().getFullYear() || parseInt(year) < 0) {
            newErrors.year = 'Enter a valid year';
        }
        if (!isbn) {
            newErrors.isbn = 'ISBN is required';
        } else if (!/^(97[89]-?\d-?\d{1,5}-?\d{1,7}-?\d{1,7}-?\d|X)$/.test(isbn)) {
            newErrors.isbn = 'Enter a valid ISBN';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const newBook = {
            title,
            author,
            publicationYear: parseInt(year, 10),
            isbn,
        };

        if (isEditMode) {
            dispatch(updateBook({ ...newBook, id: book._id }));
        } else {
            dispatch(addBook(newBook));
        }
        resetForm();
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography id="add-book-modal-title" variant="h6" component="h2">
                        {isEditMode ? 'Edit Book' : 'Add New Book'}
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        margin="normal"
                        error={!!errors.title}
                        helperText={errors.title}
                        inputProps={{ maxLength: 100 }}
                    />
                    <TextField
                        label="Author"
                        fullWidth
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        margin="normal"
                        error={!!errors.author}
                        helperText={errors.author}
                        inputProps={{ maxLength: 50 }}
                    />
                    <TextField
                        label="Publication Year"
                        type="number"
                        fullWidth
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                        margin="normal"
                        error={!!errors.year}
                        helperText={errors.year}
                    />
                    <TextField
                        label="ISBN"
                        fullWidth
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        required
                        margin="normal"
                        error={!!errors.isbn}
                        helperText={errors.isbn}
                    />
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" type="submit">
                            {isEditMode ? 'Update' : 'Save'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default AddNewBookModal;
