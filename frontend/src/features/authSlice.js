import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const tokenFromLocalStorage = JSON.parse(localStorage.getItem('token'));

const initialState = {
    user: tokenFromLocalStorage || null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const LoginUser = createAsyncThunk("user/LoginUser", async (user, thunkAPI) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/login`, {
            username: user.username,
            password: user.password
        });
        // Assuming the token is returned in the response
        const token = response.data.data.accessToken;

        // Store the token in local storage
        localStorage.setItem('token', JSON.stringify(token));

        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;

            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const RefreshToken = createAsyncThunk("user/RefreshToken", async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token').replace(/["']/g, "");
        if (!token) {
            const message = "No token provided";
            return thunkAPI.rejectWithValue(message);
        }
        const response = await axios.post(`${baseUrl}/refresh-tokens`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;

            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const LogOut = createAsyncThunk("user/LogOut", async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token').replace(/["']/g, "");
        if (!token) {
            const message = "No token provided";
            return thunkAPI.rejectWithValue(message);
        }

        const response = await axios.post(`${baseUrl}/auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        localStorage.removeItem('token');

        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;

            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
        // Post refresh token
        builder.addCase(RefreshToken.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(RefreshToken.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(RefreshToken.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
        // Logout
        builder.addCase(LogOut.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LogOut.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = null;
        });
        builder.addCase(LogOut.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || 'Logout failed';
        });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
