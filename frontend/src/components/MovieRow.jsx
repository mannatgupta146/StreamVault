import React, { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import MovieCard from "./MovieCard"
import "./MovieRow.scss"

const MovieRow = ({ title, movies = [], isLargeRow = false }) => {
  const rowRef = useRef(null)

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 1.5
          : scrollLeft + clientWidth / 1.5

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  return (
    <div className="movie-row">
      <h2>{title}</h2>

      <div className="slider-container">
        <button
          className="slider-arrow left"
          onClick={() => handleScroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft size={40} />
        </button>

        <div className="row-posters" ref={rowRef}>
          {(movies || []).map(
            (movie) =>
              (movie.poster_path || movie.backdrop_path) && (
                <MovieCard
                  key={movie.id || movie.tmdb_id || movie._id}
                  movie={movie}
                  isLargeRow={isLargeRow}
                />
              ),
          )}
        </div>

        <button
          className="slider-arrow right"
          onClick={() => handleScroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  )
}

export default MovieRow
