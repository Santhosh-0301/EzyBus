import axios from 'axios';
import config from '@/lib/config';

const api = axios.create({
    baseURL: config.apiUrl,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('ezybus_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            const token = localStorage.getItem('ezybus_token');
            // If we are currently running a mock session for UI testing, do not execute forced logouts
            if (token && token.startsWith('mock-')) {
                return Promise.reject(error);
            }

            localStorage.removeItem('ezybus_token');
            localStorage.removeItem('ezybus_user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
