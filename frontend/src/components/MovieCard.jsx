import React, { useState } from "react"
import { Play, Plus, Check, ThumbsUp, ChevronDown } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  addFavorite,
  removeFavorite,
  likeMovie,
  unlikeMovie,
} from "../features/interactions/interactionsSlice"
import TrailerModal from "./TrailerModal"
import "./MovieCard.scss"

const MovieCard = ({ movie, isLargeRow }) => {
  if (!movie) return null
  // Add handler for favorite toggle
  const handleFavoriteToggle = (e) => {
    e.stopPropagation()
    if (!user) return
    if (isFavorited) {
      dispatch(removeFavorite(movieTmdbId))
    } else {
      dispatch(
        addFavorite({
          tmdb_id: movieTmdbId,
          title: movie.title,
          name: movie.name,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: movie.overview,
          vote_average: movie.vote_average,
          release_date: movie.release_date || movie.first_air_date,
          media_type: movie.media_type,
        }),
      )
    }
  }
  const [isHovered, setIsHovered] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { favorites, liked } = useSelector((state) => state.interactions)

  // Always use tmdb_id for favorites, fallback to id for TMDB API results
  const movieTmdbId =
    typeof movie.tmdb_id === "number" ? movie.tmdb_id : movie.id
  const isLiked = liked && liked.includes(movieTmdbId)

  // Check if the movie is in favorites
  const isFavorited =
    favorites &&
    favorites.some((fav) => {
      // Support both TMDB and backend favorite objects
      return (fav.id || fav.tmdb_id) === movieTmdbId
    })

  const imgBaseUrl = "https://image.tmdb.org/t/p/w500"
  // fallback placeholders
  const backupImg = "https://via.placeholder.com/500x750?text=No+Poster"
  const imagePath = isLargeRow ? movie.poster_path : movie.backdrop_path

  const imageUrl = imagePath
    ? typeof imagePath === "string" && imagePath.startsWith("http")
      ? imagePath
      : `${imgBaseUrl}${imagePath}`
    : backupImg

  const title = movie.title || movie.name || movie.original_name || "Untitled"

  const handleLikeToggle = (e) => {
    e.stopPropagation()
    if (!user) return
    if (isLiked) {
      dispatch(unlikeMovie(movieTmdbId))
    } else {
      dispatch(
        likeMovie({
          tmdb_id: movieTmdbId,
          title: movie.title,
          name: movie.name,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: movie.overview,
          vote_average: movie.vote_average,
          release_date: movie.release_date || movie.first_air_date,
          media_type: movie.media_type,
        }),
      )
    }
  }

  const handlePlayTrailer = (e) => {
    e.stopPropagation()
    setShowModal(true)
  }

  const handleNavigate = () => {
    const type =
      movie.media_type === "tv" || movie.first_air_date ? "tv" : "movie"
    navigate(`/detail/${type}/${movieTmdbId}`)
  }

  return (
    <>
      <div
        className={`movie-card ${isLargeRow ? "large" : ""} fade-in`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleNavigate}
      >
        <img src={imageUrl} alt={title} className="card-image" loading="lazy" />

        {isHovered && (
          <div className="card-hover-info">
            <div className="action-buttons">
              <button className="play-btn" onClick={handlePlayTrailer}>
                <Play fill="currentColor" size={14} />
              </button>
              <button
                className={`icon-btn ${isFavorited ? "active" : ""}`}
                onClick={handleFavoriteToggle}
              >
                {isFavorited ? <Check size={16} /> : <Plus size={16} />}
              </button>
              <button
                className={`icon-btn${isLiked ? " liked" : ""}`}
                onClick={handleLikeToggle}
              >
                <ThumbsUp size={16} />
              </button>
              <button
                className="icon-btn expand-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNavigate()
                }}
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="metadata">
              <span className="match">
                {movie.vote_average
                  ? Math.round(movie.vote_average * 10)
                  : "New"}
                % Match
              </span>
              <span className="rating">{movie.adult ? "R" : "PG-13"}</span>
              <span className="duration">
                {(movie.release_date || movie.first_air_date || "").substring(
                  0,
                  4,
                )}
              </span>
            </div>

            <ul className="genres">
              <li>{title}</li>
            </ul>
          </div>
        )}
      </div>

      {showModal && (
        <TrailerModal onClose={() => setShowModal(false)} movie={movie} />
      )}
    </>
  )
}

export default MovieCard
