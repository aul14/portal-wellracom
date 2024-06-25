import { store } from '../app/store.js';
import { RefreshToken } from './AuthSlice.js';

export const CheckExpToken = async () => {
    const tokenLocal = localStorage.getItem('token').replace(/["']/g, "");
    if (!tokenLocal) return;

    // Decode token untuk mendapatkan waktu kadaluarsa (JWT biasanya dalam bentuk base64)
    // const tokenPayload = JSON.parse(atob(tokenLocal.split('.')[1]));
    // const exp = tokenPayload.exp;
    // const currentTime = Math.floor(Date.now() / 1000);

    try {
        await store.dispatch(RefreshToken());
    } catch (error) {
        console.error('Failed to refresh token', error);
        // Optional: Handle error (e.g., log out the user)
    }
}