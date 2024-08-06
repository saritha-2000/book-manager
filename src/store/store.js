import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/Books/booksSlice';
import notificationsReducer from '../features/notificationsSlice';

const store = configureStore({
    reducer: {
        books: booksReducer,
        notifications: notificationsReducer,
    },
});

export default store;