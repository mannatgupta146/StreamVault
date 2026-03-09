import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/users/"

const initialState = {
  favorites: [],
  history: [],
  liked: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

// Like Movie (local only, extend to backend if needed)
export const likeMovie = createAsyncThunk(
  "interactions/likeMovie",
  async (movieData, thunkAPI) => {
    // Optionally, persist to backend here
    return movieData.tmdb_id
  }
)

export const unlikeMovie = createAsyncThunk(
  "interactions/unlikeMovie",
  async (tmdbId, thunkAPI) => {
    // Optionally, persist to backend here
    return tmdbId
  }
)

// Favorites
export const getFavorites = createAsyncThunk(
  "interactions/getFavorites",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get(API_URL + "favorites", config)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      )
    }
  },
)

// movieData should be an object with: { tmdb_id, title, name, poster_path, backdrop_path, overview, vote_average, release_date, media_type }
export const addFavorite = createAsyncThunk(
  "interactions/addFavorite",
  async (movieData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post(
        API_URL + "favorites",
        movieData,
        config,
      )
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      )
    }
  },
)

export const removeFavorite = createAsyncThunk(
  "interactions/removeFavorite",
  async (tmdbId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.delete(
        API_URL + "favorites/" + tmdbId,
        config,
      )
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      )
    }
  },
)

// Watch History
export const getHistory = createAsyncThunk(
  "interactions/getHistory",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get(API_URL + "history", config)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      )
    }
  },
)

// movieData should be an object with: { tmdb_id, title, name, poster_path, backdrop_path, overview, vote_average, release_date, media_type }
export const addToHistory = createAsyncThunk(
  "interactions/addToHistory",
  async (movieData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post(API_URL + "history", movieData, config)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      )
    }
  },
)

export const removeFromHistory = createAsyncThunk(
  "interactions/removeFromHistory",
  async (tmdbId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.delete(API_URL + "history/" + tmdbId, config)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      )
    }
  },
)

export const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {
    resetInteractions: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Like/Unlike
      .addCase(likeMovie.fulfilled, (state, action) => {
        if (!state.liked.includes(action.payload)) {
          state.liked.push(action.payload)
        }
      })
      .addCase(unlikeMovie.fulfilled, (state, action) => {
        state.liked = state.liked.filter((id) => id !== action.payload)
      })
      // Favorites Listeners
      .addCase(getFavorites.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.isLoading = false
        state.favorites = action.payload
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload
      })

      // History Listeners
      .addCase(getHistory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.history = action.payload
      })
      .addCase(addToHistory.fulfilled, (state, action) => {
        state.history = action.payload
      })
      .addCase(removeFromHistory.fulfilled, (state, action) => {
        state.history = action.payload
      })
  },
})

export const { resetInteractions } = interactionsSlice.actions
export default interactionsSlice.reducer
