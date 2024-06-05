import { configureStore } from '@reduxjs/toolkit';
import authReducer from 'features/AuthSlice';
import permissionReducer from 'features/PermissionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        permissions: permissionReducer
    },
});
