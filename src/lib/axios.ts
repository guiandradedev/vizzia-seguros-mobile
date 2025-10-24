import env from '@/utils/env';
import { getSecure } from '@/utils/secure-store';
import Axios from 'axios';

export const axiosNoAuth = Axios.create({
    baseURL: env.API_BASE_URL || 'http://172.16.231.167:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const axiosIA = Axios.create({
    baseURL: env.IA_BASE_URL || 'http://172.16.231.167:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const axios = Axios.create({
    baseURL: env.API_BASE_URL || 'http://172.16.231.167:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

        console.log("INTERCEPTOR ERROR", error.response?.status);

        if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry) {
            // originalRequest._retry = true;

            // const token = await getSecure("refreshToken");
            // // console.log("REFRESH TOKEN:", token);
            // if (token) {
            //     return axios.post('/auth/refresh-token', { refreshToken: token })
            //         .then(res => {
            //             console.log("TOKEN ATUALIZADO:", res.data);
            //             saveSecure('accessToken', res.data.accessToken);
            //             saveSecure('refreshToken', res.data.refreshToken);
            //             originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

            //             return axios(originalRequest);
            //         });
            // } else {
            //     return Promise.reject(error);
            // }
        }
        return Promise.reject(error);
    }
);

export default axios;