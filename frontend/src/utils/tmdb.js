import axios from "axios"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN
const BASE_URL = "https://api.themoviedb.org/3"

const tmdbAxios = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
  headers: ACCESS_TOKEN
    ? {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      }
    : {},
})

// Trending
export const fetchTrending = () => tmdbAxios.get("/trending/all/week")
export const fetchTrendingTV = () => tmdbAxios.get("/trending/tv/week")
export const fetchTrendingMovies = () => tmdbAxios.get("/trending/movie/week")

// Popular
export const fetchPopularMovies = () => tmdbAxios.get("/movie/popular")
export const fetchPopularTV = () => tmdbAxios.get("/tv/popular")

// Top Rated
export const fetchTopRated = () => tmdbAxios.get("/movie/top_rated")
export const fetchTopRatedTV = () => tmdbAxios.get("/tv/top_rated")

// Discover by genre / network
export const fetchNetflixOriginals = () =>
  tmdbAxios.get("/discover/tv", { params: { with_networks: 213 } })
export const fetchActionMovies = () =>
  tmdbAxios.get("/discover/movie", { params: { with_genres: 28 } })
export const fetchComedyMovies = () =>
  tmdbAxios.get("/discover/movie", { params: { with_genres: 35 } })
export const fetchHorrorMovies = () =>
  tmdbAxios.get("/discover/movie", { params: { with_genres: 27 } })
export const fetchRomanceMovies = () =>
  tmdbAxios.get("/discover/movie", { params: { with_genres: 10749 } })
export const fetchDocumentaries = () =>
  tmdbAxios.get("/discover/movie", { params: { with_genres: 99 } })

// People
export const fetchPopularPeople = (page = 1) =>
  tmdbAxios.get("/person/popular", { params: { page } })
export const fetchPersonDetails = (personId) =>
  tmdbAxios.get(`/person/${personId}`)
export const fetchPersonCredits = (personId) =>
  tmdbAxios.get(`/person/${personId}/combined_credits`)
export const fetchPersonImages = (personId) =>
  tmdbAxios.get(`/person/${personId}/images`)

// Movie / TV Details & Media
export const fetchMovieDetails = (movieId) => tmdbAxios.get(`/movie/${movieId}`)
export const fetchMovieImages = (movieId) =>
  tmdbAxios.get(`/movie/${movieId}/images`)
export const fetchMovieVideos = (movieId) =>
  tmdbAxios.get(`/movie/${movieId}/videos`, { params: { language: "en-US" } })
export const fetchTVDetails = (tvId) => tmdbAxios.get(`/tv/${tvId}`)
export const fetchTVImages = (tvId) => tmdbAxios.get(`/tv/${tvId}/images`)
export const fetchTVVideos = (tvId) =>
  tmdbAxios.get(`/tv/${tvId}/videos`, { params: { language: "en-US" } })
export const fetchSimilarMovies = (movieId) =>
  tmdbAxios.get(`/movie/${movieId}/similar`)
export const fetchSimilarTV = (tvId) => tmdbAxios.get(`/tv/${tvId}/similar`)

// Search (multi covers movies, TV, and people)
export const fetchSearchResults = (query, page = 1) =>
  tmdbAxios.get("/search/multi", { params: { query, page } })

export default tmdbAxios
