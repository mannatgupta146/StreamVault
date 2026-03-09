import React, { useState } from "react"
import { Play, Info } from "lucide-react"
import { useNavigate } from "react-router-dom"
import TrailerModal from "./TrailerModal"
import "./HeroBanner.scss"

const HeroBanner = ({ movie }) => {
  const [showTrailer, setShowTrailer] = useState(false)
  const navigate = useNavigate()

  if (!movie) {
    return (
      <header
        className="hero-banner fade-in"
        style={{ backgroundColor: "#111" }}
      >
        <div className="hero-content">
          <h1 className="hero-title">Welcome to StreamVault</h1>
          <h1 className="hero-description">
            Please configure your TMDB API Key in <code>src/utils/tmdb.js</code>{" "}
            to load real movie data.
          </h1>
        </div>
        <div className="hero-fade-bottom" />
      </header>
    )
  }

  // TMDB image base URL
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const backupImg = "https://via.placeholder.com/1280x720?text=No+Backdrop"

  const title =
    movie?.title || movie?.name || movie?.original_name || "Untitled"

  // Truncate long descriptions
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str
  }

  const bgImage = movie?.backdrop_path
    ? `url("${imgBaseUrl}${movie.backdrop_path}")`
    : `url('${backupImg}')`

  return (
    <header
      className="hero-banner fade-in"
      style={{
        backgroundImage: bgImage,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <div className="hero-buttons">
          <button className="btn btn-play" onClick={() => setShowTrailer(true)}>
            <Play fill="currentColor" size={20} />
            Play
          </button>
          <button
            className="btn btn-info"
            onClick={() => {
              const type =
                movie?.media_type === "tv" || movie?.first_air_date
                  ? "tv"
                  : "movie"
              navigate(`/detail/${type}/${movie?.id}`)
            }}
          >
            <Info size={20} />
            More Info
          </button>
        </div>
        <h1 className="hero-description">
          {truncate(movie?.overview || "Description not available", 150)}
        </h1>
      </div>

      <div className="hero-fade-bottom" />

      {showTrailer && (
        <TrailerModal onClose={() => setShowTrailer(false)} movie={movie} />
      )}
    </header>
  )
}

export default HeroBanner
