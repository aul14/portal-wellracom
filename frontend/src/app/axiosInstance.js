import axios from 'axios';
import { store } from './store.js'; // Sesuaikan impor sesuai lokasi store Anda
import { RefreshToken, LogOut, LoginUser } from '../features/AuthSlice.js';

const baseUrl = process.env.REACT_APP_API_BASE_URL

const axiosInstance = axios.create({
    baseURL: baseUrl,
});

const navigateTo = (path) => {
    // Navigate to the specified path
    // You can use your preferred navigation method here
    window.location.href = path;
};

// Interceptor permintaan untuk menambahkan token ke header
axiosInstance.interceptors.request.use(async (config) => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor respons untuk menangani kadaluwarsa token
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 403 && error.response.data.msg === "You don't have permission!") {
            // Lakukan navigasi ke halaman akses ditolak
            navigateTo('/acces-denied');
            // window.location.href = '/admin/access-denied'
            return Promise.reject(error);
        }

        if (error.response.status === 403 && error.response.data.msg === 'jwt expired' && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');

                navigateTo('/auth/login'); // Arahkan pengguna ke halaman login

                // const refreshResponse = await store.dispatch(RefreshToken());
                // const newToken = refreshResponse.payload.data.accessToken;

                // // Perbarui token di local storage
                // localStorage.setItem('token', JSON.stringify(newToken));

                // // Perbarui header Authorization dan ulangi permintaan
                // originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Jika refresh token juga kadaluwarsa, logout pengguna
                if (refreshError.response && refreshError.response.data.msg === 'jwt expired') {
                    await store.dispatch(LogOut());
                    navigateTo('/auth/login'); // Arahkan pengguna ke halaman login
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
