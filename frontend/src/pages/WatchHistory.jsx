import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  getHistory,
  removeFromHistory,
} from "../features/interactions/interactionsSlice"
import MovieCard from "../components/MovieCard"
import Loader from "../components/Loader"

const WatchHistory = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { history, isLoading, isError, message } = useSelector(
    (state) => state.interactions,
  )

  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate("/login")
    } else {
      dispatch(getHistory())
    }
  }, [user, navigate, isError, message, dispatch])

  if (isLoading) {
    return (
      <div className="page fade-in" style={{ paddingTop: "80px" }}>
        <Loader count={4} />
      </div>
    )
  }

  return (
    <div
      className="page fade-in"
      style={{ paddingTop: "100px", paddingLeft: "4rem", paddingRight: "4rem" }}
    >
      <h1 style={{ marginBottom: "2rem" }}>Watch History</h1>

      {history.length > 0 ? (
        <div
          className="movie-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          {history.map((movie) => (
            <div
              key={movie.tmdb_id || movie._id}
              style={{ position: "relative" }}
            >
              <MovieCard movie={movie} />
              <button
                onClick={() => dispatch(removeFromHistory(movie.tmdb_id))}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "#ff4d4f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.4rem 0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  zIndex: 30,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
                title="Remove from history"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Your watch history is empty. Go watch some trailers!</p>
      )}
    </div>
  )
}

export default WatchHistory
