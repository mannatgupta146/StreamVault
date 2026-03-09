import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { addToHistory } from "../features/interactions/interactionsSlice"
import tmdbAxios from "../utils/tmdb"
import "./TrailerModal.scss"

// Pick the best YouTube video: Trailer > Teaser > Clip > any
const pickBestVideo = (results) => {
  if (!results || results.length === 0) return null
  const ytVideos = results.filter((v) => v.site === "YouTube")
  if (ytVideos.length === 0) return null
  return (
    ytVideos.find((v) => v.type === "Trailer") ||
    ytVideos.find((v) => v.type === "Teaser") ||
    ytVideos.find((v) => v.type === "Clip") ||
    ytVideos[0]
  )
}

const TrailerModal = ({ onClose, movie }) => {
  const [trailerKey, setTrailerKey] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  // Support both TMDB movies (id) and backend favorites (tmdb_id)
  const movieId = movie?.id || movie?.tmdb_id

  useEffect(() => {
    if (!movieId) {
      setLoading(false)
      return
    }

    // Save to watch history if user is logged in
    if (user && movie) {
      dispatch(
        addToHistory({
          tmdb_id: movieId,
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

    const fetchTrailer = async () => {
      try {
        setLoading(true)
        setError(false)

        // Try movie endpoint first, then TV if it fails
        let res
        try {
          res = await tmdbAxios.get(`/movie/${movieId}/videos`, {
            params: { language: "en-US" },
          })
        } catch {
          res = await tmdbAxios.get(`/tv/${movieId}/videos`, {
            params: { language: "en-US" },
          })
        }

        const best = pickBestVideo(res.data.results)
        if (best) {
          setTrailerKey(best.key)
        }
      } catch (err) {
        console.error("Error fetching trailer", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTrailer()
  }, [movieId])

  // Handle clicking outside the modal content
  const handleBackdropClick = (e) => {
    if (
      e.target.className &&
      typeof e.target.className === "string" &&
      e.target.className.includes("trailer-modal-backdrop")
    ) {
      onClose()
    }
  }

  return (
    <div
      className="trailer-modal-backdrop fade-in"
      onClick={handleBackdropClick}
    >
      <div className="trailer-modal-content zoom-in">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={30} />
        </button>
        <div className="video-container">
          {loading ? (
            <div className="trailer-loading">
              <div className="spinner" />
              <p>Loading Trailer...</p>
            </div>
          ) : trailerKey ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="no-trailer">
              <h3>Trailer not available</h3>
              <p>Trailer for this movie is currently unavailable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrailerModal
