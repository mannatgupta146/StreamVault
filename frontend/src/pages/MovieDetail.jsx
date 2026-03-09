import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Play, Plus, Check } from "lucide-react"
import {
  addFavorite,
  removeFavorite,
} from "../features/interactions/interactionsSlice"
import MovieRow from "../components/MovieRow"
import TrailerModal from "../components/TrailerModal"
import Loader from "../components/Loader"
import {
  fetchMovieDetails,
  fetchMovieImages,
  fetchMovieVideos,
  fetchSimilarMovies,
  fetchTVDetails,
  fetchTVImages,
  fetchTVVideos,
  fetchSimilarTV,
} from "../utils/tmdb"
import "./MovieDetail.scss"

const MovieDetail = () => {
  const { type, id } = useParams() // type = 'movie' or 'tv'
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { favorites } = useSelector((state) => state.interactions)

  const [details, setDetails] = useState(null)
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)

  const isMovie = type === "movie"

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [detailsRes, imagesRes, videosRes, similarRes] =
          await Promise.all(
            isMovie
              ? [
                  fetchMovieDetails(id),
                  fetchMovieImages(id),
                  fetchMovieVideos(id),
                  fetchSimilarMovies(id),
                ]
              : [
                  fetchTVDetails(id),
                  fetchTVImages(id),
                  fetchTVVideos(id),
                  fetchSimilarTV(id),
                ],
          )
        setDetails(detailsRes.data)
        setImages([
          ...(imagesRes.data.backdrops || []).slice(0, 12),
          ...(imagesRes.data.posters || []).slice(0, 6),
        ])
        setVideos(videosRes.data.results || [])
        setSimilar(similarRes.data.results || [])
      } catch (error) {
        console.error("Error fetching details", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) load()
  }, [type, id, isMovie])

  if (loading) {
    return (
      <div className="page fade-in" style={{ paddingTop: "80px" }}>
        <Loader count={8} />
      </div>
    )
  }

  if (!details) {
    return (
      <div
        className="page fade-in"
        style={{ paddingTop: "100px", textAlign: "center" }}
      >
        <h2>Could not load details.</h2>
      </div>
    )
  }

  const imgBase = "https://image.tmdb.org/t/p"
  const backupPoster = "https://via.placeholder.com/500x750?text=No+Poster"
  const backupBackdrop = "https://via.placeholder.com/1280x720?text=No+Backdrop"
  const title = details.title || details.name || "Untitled"
  const overview = details.overview || "Description not available"
  const releaseDate = details.release_date || details.first_air_date || ""
  const rating = details.vote_average
    ? Math.round(details.vote_average * 10)
    : null
  const genres = (details.genres || []).map((g) => g.name).join(", ")
  const runtime = details.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details.number_of_seasons
      ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? "s" : ""}`
      : ""

  const isFav = favorites.some((f) => f.tmdb_id === Number(id))
  const movieObj = {
    id: Number(id),
    title: details.title,
    name: details.name,
    poster_path: details.poster_path,
    backdrop_path: details.backdrop_path,
    overview: details.overview,
    vote_average: details.vote_average,
    release_date: releaseDate,
    media_type: type,
  }

  const handleFavorite = () => {
    if (!user) return
    if (isFav) {
      dispatch(removeFavorite(Number(id)))
    } else {
      dispatch(
        addFavorite({
          tmdb_id: Number(id),
          title: details.title,
          name: details.name,
          poster_path: details.poster_path,
          backdrop_path: details.backdrop_path,
          overview: details.overview,
          vote_average: details.vote_average,
          release_date: releaseDate,
          media_type: type,
        }),
      )
    }
  }

  const youtubeVideos = videos.filter((v) => v.site === "YouTube")

  return (
    <div className="movie-detail fade-in">
      {/* Hero backdrop */}
      <div
        className="detail-hero"
        style={{
          backgroundImage: details.backdrop_path
            ? `url("${imgBase}/original${details.backdrop_path}")`
            : `url('${backupBackdrop}')`,
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <img
              className="detail-poster"
              src={
                details.poster_path
                  ? `${imgBase}/w500${details.poster_path}`
                  : backupPoster
              }
              alt={title}
            />
            <div className="detail-info">
              <h1>{title}</h1>
              <div className="detail-meta">
                {rating && <span className="match">{rating}% Match</span>}
                {releaseDate && <span>{releaseDate.substring(0, 4)}</span>}
                {runtime && <span>{runtime}</span>}
              </div>
              {genres && <p className="detail-genres">{genres}</p>}
              <p className="detail-overview">{overview}</p>
              <div className="detail-actions">
                <button
                  className="btn btn-play"
                  onClick={() => setShowTrailer(true)}
                >
                  <Play fill="currentColor" size={18} /> Play Trailer
                </button>
                {user && (
                  <button
                    className={`btn btn-fav ${isFav ? "active" : ""}`}
                    onClick={handleFavorite}
                  >
                    {isFav ? <Check size={18} /> : <Plus size={18} />}
                    {isFav ? "In Favorites" : "Add to Favorites"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Videos section */}
      <section className="detail-section">
        <h2>Videos &amp; Trailers</h2>
        {youtubeVideos.length > 0 ? (
          <div className="videos-grid">
            {youtubeVideos.slice(0, 6).map((video) => (
              <div key={video.id} className="video-thumb">
                <iframe
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={video.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <p>{video.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-trailer">
            <h3>Trailer not available</h3>
            <p>Trailer for this movie is currently unavailable.</p>
          </div>
        )}
      </section>

      {/* Images / Media section */}
      {images.length > 0 && (
        <section className="detail-section">
          <h2>Images &amp; Media</h2>
          <div className="images-grid">
            {images.map((img, i) => (
              <div key={i} className="image-thumb">
                <img
                  src={`${imgBase}/w780${img.file_path}`}
                  alt={`Still ${i + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar titles */}
      {similar.length > 0 && (
        <section className="detail-section">
          <MovieRow title="Similar Titles" movies={similar} />
        </section>
      )}

      {showTrailer && (
        <TrailerModal onClose={() => setShowTrailer(false)} movie={movieObj} />
      )}
    </div>
  )
}

export default MovieDetail
