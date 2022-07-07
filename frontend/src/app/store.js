import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/authSlice.js';
import chatSlice from '../features/chatSlice.js';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        chat: chatSlice,
    },
});