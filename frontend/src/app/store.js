import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import movieReducer from '../features/movies/movieSlice';
import interactionsReducer from '../features/interactions/interactionsSlice';
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    interactions: interactionsReducer,
    admin: adminReducer,
  },
});
