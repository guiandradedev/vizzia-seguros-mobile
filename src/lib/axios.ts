import { Tokens } from '@/types/auth';
import { getSecure, saveSecure } from '@/utils/secure-store';
import Axios, { AxiosResponse } from 'axios';

export const axios = Axios.create({
    baseURL: process.env.API_BASE_URL || 'http://172.16.234.109:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add interceptors for requests and responses
axios.interceptors.request.use(
    async config => {
        const token = await getSecure("accessToken")
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);
axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            // 1. RETURN the promise chain that starts with getting the refresh token.
            const token = await getSecure("refreshToken");
            if (token) {
                // 2. RETURN the promise from the refresh token POST request.
                return axios.post('/auth/refresh-token', { refreshToken: token })
                    .then(res => {
                        // Save tokens, update header...
                        saveSecure('accessToken', res.data.accessToken);
                        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

                        // 3. RETURN the promise of the retried original request.

                        console.log("passou aqui")
                        return axios(originalRequest);
                    });
            } else {
                // No refresh token, stop here.
                return Promise.reject(error);
            }
        }

        // For all other errors, just reject with the original error.
        return Promise.reject(error);
    }
);

export default axios;