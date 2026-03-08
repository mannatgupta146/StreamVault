import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbAxios = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY, 
  },
  headers: ACCESS_TOKEN ? {
    Authorization: `Bearer ${ACCESS_TOKEN}`
  } : {}
});

export const fetchTrending = () => tmdbAxios.get(`/trending/all/week`);
export const fetchTrendingTV = () => tmdbAxios.get(`/trending/tv/week`);
export const fetchTopRatedTV = () => tmdbAxios.get(`/tv/top_rated`);
export const fetchPopularTV = () => tmdbAxios.get(`/tv/popular`);
export const fetchNetflixOriginals = () => tmdbAxios.get(`/discover/tv?with_networks=213`);
export const fetchTopRated = () => tmdbAxios.get(`/movie/top_rated`);
export const fetchActionMovies = () => tmdbAxios.get(`/discover/movie?with_genres=28`);
export const fetchComedyMovies = () => tmdbAxios.get(`/discover/movie?with_genres=35`);
export const fetchHorrorMovies = () => tmdbAxios.get(`/discover/movie?with_genres=27`);
export const fetchRomanceMovies = () => tmdbAxios.get(`/discover/movie?with_genres=10749`);
export const fetchDocumentaries = () => tmdbAxios.get(`/discover/movie?with_genres=99`);

// Utility for fetching paginated Search Results
export const fetchSearchResults = (query, page = 1) => 
  tmdbAxios.get(`/search/multi?query=${query}&page=${page}`);

export default tmdbAxios;
