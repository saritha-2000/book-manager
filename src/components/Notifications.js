import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { hideNotification } from '../features/notificationsSlice';

const Notifications = () => {
    const dispatch = useDispatch();
    const notification = useSelector((state) => state.notifications);

    const handleClose = () => {
        dispatch(hideNotification());
    };

    return (
        <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={notification.type} sx={{ width: '100%' }}>
                {notification.message}
            </Alert>
        </Snackbar>
    );
};

export default Notifications;