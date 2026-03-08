import User from '../models/User.js';
import Movie from '../models/Movie.js';

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add movie to favorites
// @route   POST /api/users/favorites/:movieId
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const user = await User.findById(req.user.id);
    
    // Check if already in favorites
    if (user.favorites.includes(movie._id)) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }

    user.favorites.push(movie._id);
    await user.save();
    
    // Return populated favorites
    const updatedUser = await User.findById(req.user.id).populate('favorites');
    res.json(updatedUser.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove movie from favorites
// @route   DELETE /api/users/favorites/:movieId
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.movieId
    );
    
    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('favorites');
    res.json(updatedUser.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user watch history
// @route   GET /api/users/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('history');
    res.json(user.history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add movie to watch history
// @route   POST /api/users/history/:movieId
// @access  Private
export const addToHistory = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const user = await User.findById(req.user.id);

    // Remove if already exists so we can push it to the front (latest)
    user.history = user.history.filter(
      (id) => id.toString() !== movie._id.toString()
    );

    // Add to the beginning of the array
    user.history.unshift(movie._id);

    // Optional: Keep history to max 50 items
    if (user.history.length > 50) {
      user.history.pop();
    }

    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('history');
    res.json(updatedUser.history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
