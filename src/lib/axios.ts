import Axios from 'axios';

console.log(process.env.API_BASE_URL)
export const axios = Axios.create({
    baseURL: process.env.API_BASE_URL || 'http://172.16.231.243:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add interceptors for requests and responses
axios.interceptors.request.use(
    config => {
        // Add auth token or other headers here if needed
        return config;
    },
    error => Promise.reject(error)
);

axios.interceptors.response.use(
    response => response,
    error => {
        // Handle errors globally
        return Promise.reject(error);
    }
);

export default axios;