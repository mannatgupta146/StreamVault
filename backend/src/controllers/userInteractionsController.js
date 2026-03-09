import User from "../models/User.js"

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json(user.favorites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Add movie to favorites
// @route   POST /api/users/favorites
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    const {
      tmdb_id,
      title,
      name,
      poster_path,
      backdrop_path,
      overview,
      vote_average,
      release_date,
      media_type,
    } = req.body

    if (!tmdb_id) {
      return res.status(400).json({ message: "tmdb_id is required" })
    }

    const user = await User.findById(req.user.id)

    // Check if already in favorites
    if (user.favorites.some((fav) => fav.tmdb_id === tmdb_id)) {
      return res.status(400).json({ message: "Movie already in favorites" })
    }

    user.favorites.push({
      tmdb_id,
      title,
      name,
      poster_path,
      backdrop_path,
      overview,
      vote_average,
      release_date,
      media_type,
    })
    await user.save()

    res.json(user.favorites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Remove movie from favorites
// @route   DELETE /api/users/favorites/:tmdbId
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    const tmdbId = Number(req.params.movieId)
    const user = await User.findById(req.user.id)

    user.favorites = user.favorites.filter((fav) => fav.tmdb_id !== tmdbId)

    await user.save()
    res.json(user.favorites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user watch history
// @route   GET /api/users/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json(user.history)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Add movie to watch history
// @route   POST /api/users/history
// @access  Private
export const addToHistory = async (req, res) => {
  try {
    const {
      tmdb_id,
      title,
      name,
      poster_path,
      backdrop_path,
      overview,
      vote_average,
      release_date,
      media_type,
    } = req.body

    if (!tmdb_id) {
      return res.status(400).json({ message: "tmdb_id is required" })
    }

    const user = await User.findById(req.user.id)

    // Remove if already exists so we can push it to the front (latest)
    user.history = user.history.filter((item) => item.tmdb_id !== tmdb_id)

    // Add to the beginning of the array
    user.history.unshift({
      tmdb_id,
      title,
      name,
      poster_path,
      backdrop_path,
      overview,
      vote_average,
      release_date,
      media_type,
    })

    // Keep history to max 50 items
    if (user.history.length > 50) {
      user.history.pop()
    }

    await user.save()
    res.json(user.history)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Remove movie from watch history
// @route   DELETE /api/users/history/:movieId
// @access  Private
export const removeFromHistory = async (req, res) => {
  try {
    const tmdbId = Number(req.params.movieId)
    const user = await User.findById(req.user.id)
    user.history = user.history.filter((item) => item.tmdb_id !== tmdbId)
    await user.save()
    res.json(user.history)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
