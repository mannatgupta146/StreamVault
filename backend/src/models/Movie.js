import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    poster_path: {
      type: String,
    },
    backdrop_path: {
      type: String,
    },
    trailer_url: {
      type: String,
    },
    release_date: {
      type: String,
    },
    genre: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Trending', 'Popular', 'Movies', 'TV Shows'],
      default: 'Movies',
    },
    tmdb_id: {
      type: String, // Optional mapping to original TMDB id if pulled from there
    }
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', MovieSchema);

export default Movie;
