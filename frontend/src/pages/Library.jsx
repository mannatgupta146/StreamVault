import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getFavorites } from "../features/interactions/interactionsSlice"
import MovieCard from "../components/MovieCard"
import Loader from "../components/Loader"
import { Heart, Star } from "lucide-react"
import "./Library.scss"

const Library = () => {
  const [activeTab, setActiveTab] = useState("favorites")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { favorites, liked, isLoading } = useSelector(
    (state) => state.interactions,
  )

  useEffect(() => {
    if (!user) {
      navigate("/login")
    } else {
      dispatch(getFavorites())
    }
  }, [user, navigate, dispatch])

  if (isLoading) {
    return (
      <div className="page fade-in" style={{ paddingTop: "80px" }}>
        <Loader count={4} />
      </div>
    )
  }

  const activeList = activeTab === "favorites" ? favorites : liked

  return (
    <div className="library-page fade-in">
      <div className="library-header">
        <h1>My Library</h1>
        <p>Your personal collection of saved content.</p>

        <div className="library-tabs">
          <button
            className={`tab-btn ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            <Heart size={18} />
            Favourites
            {favorites.length > 0 && (
              <span className="tab-count">{favorites.length}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === "liked" ? "active" : ""}`}
            onClick={() => setActiveTab("liked")}
          >
            <Star size={18} />
            Liked
            {liked.length > 0 && (
              <span className="tab-count">{liked.length}</span>
            )}
          </button>
        </div>
      </div>

      {activeList.length > 0 ? (
        <div className="library-grid">
          {activeList
            .filter((item) => item && (typeof item.tmdb_id === "number" || item.id))
            .map((item, idx) => (
              <MovieCard key={item.tmdb_id || item.id || idx} movie={item} />
            ))}
        </div>
      ) : (
        <div className="library-empty">
          {activeTab === "favorites" ? (
            <>
              <Heart size={56} strokeWidth={1} />
              <h3>No Favourites Yet</h3>
              <p>Click the ❤️ on any movie or show to add it here.</p>
            </>
          ) : (
            <>
              <Star size={56} strokeWidth={1} />
              <h3>No Liked Content Yet</h3>
              <p>Click the ⭐ on any movie or show to mark it as liked.</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Library
