import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    login: localStorage.getItem('login') === 'true',
    admin: false // Assuming initial admin state is false
};

const ManagementSlice = createSlice({
    name: 'manage',
    initialState,
    reducers: {
        setLoginStatus: (state, action) => {
            state.login = action.payload;
            localStorage.setItem('login', action.payload.toString());
        },
        setAdminStatus: (state, action) => {
            state.admin = action.payload;
            // Additional logic for storing admin status in local storage if needed
        }
    }
});

export const { setLoginStatus, setAdminStatus } = ManagementSlice.actions;

export default ManagementSlice.reducer;
