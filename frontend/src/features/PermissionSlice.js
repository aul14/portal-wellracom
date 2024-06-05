// features/PermissionSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const getPermissionsFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwtDecode(token.replace(/["']/g, ""));
            return decodedToken.data.role.permissions.map(permission => permission.keyName);
        } catch (error) {
            console.error("Error decoding token:", error);
            return [];
        }
    }
    return [];
};

const initialState = {
    permissions: getPermissionsFromToken(),
};

const permissionSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {
        setPermissions(state, action) {
            state.permissions = action.payload;
        },
        addPermission(state, action) {
            state.permissions.push(action.payload);
        },
        removePermission(state, action) {
            state.permissions = state.permissions.filter(permission => permission !== action.payload);
        },
    },
});

export const { setPermissions, addPermission, removePermission } = permissionSlice.actions;
export default permissionSlice.reducer;
