import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

const initialState = {
  favorites: [],
  history: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Favorites
export const getFavorites = createAsyncThunk(
  'interactions/getFavorites',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(API_URL + 'favorites', config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const addFavorite = createAsyncThunk(
  'interactions/addFavorite',
  async (movieId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(API_URL + 'favorites/' + movieId, {}, config);
      return response.data; // returns full favorites array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'interactions/removeFavorite',
  async (movieId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.delete(API_URL + 'favorites/' + movieId, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Watch History
export const getHistory = createAsyncThunk(
  'interactions/getHistory',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(API_URL + 'history', config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const addToHistory = createAsyncThunk(
  'interactions/addToHistory',
  async (movieId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(API_URL + 'history/' + movieId, {}, config);
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const interactionsSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    resetInteractions: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Favorites Listeners
      .addCase(getFavorites.pending, (state) => { state.isLoading = true; })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      
      // History Listeners
      .addCase(getHistory.pending, (state) => { state.isLoading = true; })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload;
      })
      .addCase(addToHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
  },
});

export const { resetInteractions } = interactionsSlice.actions;
export default interactionsSlice.reducer;
