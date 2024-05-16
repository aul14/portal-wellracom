import { store } from '../app/store.js';
import { RefreshToken } from './authSlice.js';

export const checkExpToken = async () => {
    console.log("Checking token expiration..."); // Debug log
    const token = JSON.parse(localStorage.getItem('token'));
    const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
    console.log("Token:", token);
    console.log("Refresh Token:", refreshToken);
    const tokenLocal = localStorage.getItem('token').replace(/["']/g, "");
    if (!tokenLocal) return;

    // Decode token untuk mendapatkan waktu kadaluarsa (JWT biasanya dalam bentuk base64)
    const tokenPayload = JSON.parse(atob(tokenLocal.split('.')[1]));
    const exp = tokenPayload.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    // Refresh token jika masa berlaku kurang dari 5 menit (300 detik)
    // if (exp - currentTime < 300) {
    try {
        await store.dispatch(RefreshToken());
    } catch (error) {
        console.error('Failed to refresh token', error);
        // Optional: Handle error (e.g., log out the user)
    }
    // }
}