import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { showNotification } from '../notificationsSlice';

export const fetchBooks = createAsyncThunk(
    'books/fetchBooks',
    async ({ page , limit }, { dispatch }) => {
        try {
            const response = await api.get(`/books?page=${page}&limit=${limit}`);
            return { data: response.data.books, page };
        } catch (error) {
            dispatch(showNotification({ message: 'Failed to fetch books', type: 'error' }));
            throw error;
        }
    }
);

export const addBook = createAsyncThunk('books/addBook', async (book, { dispatch }) => {
    try {
        const response = await api.post('/books', book);
        dispatch(showNotification({ message: 'Book added successfully', type: 'success' }));
        return response.data;
    } catch (error) {                
        dispatch(showNotification({ message: 'The ISBN you entered already exists.', type: 'error' }));
        throw error;
    }
});

export const deleteBook = createAsyncThunk('books/deleteBook', async (id, { dispatch }) => {
    try {
        await api.delete(`/books/${id}`);
        dispatch(showNotification({ message: 'Book deleted successfully', type: 'success' }));
        return id;
    } catch (error) {
        dispatch(showNotification({ message: 'Failed to delete book', type: 'error' }));
        throw error;
    }
});

export const updateBook = createAsyncThunk('books/updateBook', async (updatedBook, { dispatch }) => {
    try {
        const { id, ...bookData } = updatedBook;
        const response = await api.put(`/books/${id}`, bookData);
        dispatch(showNotification({ message: 'Book updated successfully', type: 'success' }));
        return response.data;
    } catch (error) {
        dispatch(showNotification({ message: 'Failed to update book', type: 'error' }));
        throw error;
    }
});

const booksSlice = createSlice({
    name: 'books',
    initialState: {
        books: [],
        status: 'idle',
        error: null,
        currentPage: 1,
        hasMore: true,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentPage = action.payload.page;
                if (action.payload.page === 1) {
                    state.books = action.payload.data;
                } else {
                    state.books = [...state.books, ...action.payload.data];
                }
                state.hasMore = action.payload.data.length > 0;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addBook.fulfilled, (state, action) => {
                state.books.push(action.payload);
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.books = state.books.filter((book) => book._id !== action.payload);
            })
            .addCase(updateBook.fulfilled, (state, action) => {
                const index = state.books.findIndex((book) => book._id === action.payload._id);
                if (index !== -1) {
                    state.books[index] = action.payload;
                }
            });
    },
});

export default booksSlice.reducer;
