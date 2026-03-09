import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getFavorites } from "../features/interactions/interactionsSlice"
import MovieCard from "../components/MovieCard"
import Loader from "../components/Loader"

const Favorites = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { favorites, isLoading, isError, message } = useSelector(
    (state) => state.interactions,
  )

  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate("/login")
    } else {
      dispatch(getFavorites())
    }
  }, [user, navigate, isError, message, dispatch])

  if (isLoading) {
    return (
      <div className="page fade-in" style={{ paddingTop: "80px" }}>
        <Loader count={4} />
      </div>
    )
  }

  // Debug: log favorites array to help trace error
  console.log("Favorites array:", favorites)
  return (
    <div
      className="page fade-in"
      style={{ paddingTop: "100px", paddingLeft: "4rem", paddingRight: "4rem" }}
    >
      <h1 style={{ marginBottom: "2rem" }}>My Favorites</h1>

      {favorites.length > 0 ? (
        <div
          className="movie-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          {favorites
            .filter((movie) => movie && typeof movie.tmdb_id === "number")
            .map((movie) => (
              <div key={movie.tmdb_id}>
                <MovieCard movie={movie} />
              </div>
            ))}
        </div>
      ) : (
        <p>You haven't added any favorites yet!</p>
      )}
    </div>
  )
}

export default Favorites
