import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const loginWithGoogle = () => {
    window.open(`${process.env.REACT_APP_AUTH_URL}/google`, '_self');
};

export const logout = async () => {
    try {
        await axios.get(`${process.env.REACT_APP_AUTH_URL}/logout`, { withCredentials: true });
        console.log('Logout request sent.');

        Cookies.remove('connect.sid', { path: '/' });
        localStorage.clear();
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

export const fetchBookDetails = async (isbn) => {
    try {
        const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);        
        return response.data[`ISBN:${isbn}`];
        // const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
        // return response.data.items[0];
    } catch (error) {
        console.error('Error fetching book details:', error);
        return null;
    }
};

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
(response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;