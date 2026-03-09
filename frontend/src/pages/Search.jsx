import React, { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { Film, Tv, User, Layers } from "lucide-react"
import MovieCard from "../components/MovieCard"
import PersonCard from "../components/PersonCard"
import Loader from "../components/Loader"
import { fetchSearchResults } from "../utils/tmdb"
import { useInfiniteScroll } from "../hooks/useInfiniteScroll"
import { useDebounce } from "../hooks/useDebounce"
import "./Search.scss"

const TABS = [
  { key: "all", label: "All", icon: <Layers size={16} /> },
  { key: "movie", label: "Movies", icon: <Film size={16} /> },
  { key: "tv", label: "TV Shows", icon: <Tv size={16} /> },
  { key: "person", label: "People", icon: <User size={16} /> },
]

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawQuery = searchParams.get("q") || ""
  const query = useDebounce(rawQuery, 500)

  const [activeTab, setActiveTab] = useState("all")
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [inputValue, setInputValue] = useState(rawQuery)

  // Sync local input with URL param
  useEffect(() => {
    setInputValue(rawQuery)
  }, [rawQuery])

  // Reset when query or tab changes
  useEffect(() => {
    setResults([])
    setPage(1)
    setHasMore(true)
  }, [query, activeTab])

  // Fetch data
  useEffect(() => {
    if (!query) return

    let cancelled = false
    const loadResults = async () => {
      try {
        if (page === 1) setLoading(true)
        const res = await fetchSearchResults(query, page)
        if (cancelled) return

        let fetched = res.data.results

        // Filter by active tab
        if (activeTab !== "all") {
          fetched = fetched.filter((item) => item.media_type === activeTab)
        }

        setResults((prev) => (page === 1 ? fetched : [...prev, ...fetched]))
        setHasMore(res.data.page < res.data.total_pages)
      } catch (error) {
        console.error("Error fetching search results:", error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadResults()
    return () => {
      cancelled = true
    }
  }, [query, page, activeTab])

  const loadMoreData = useCallback(async () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1)
    }
  }, [hasMore, loading])

  const [lastElementRef] = useInfiniteScroll(loadMoreData)

  const handleInputChange = (e) => {
    const val = e.target.value
    setInputValue(val)
    setSearchParams(val.trim() ? { q: val } : {})
  }

  // Counts for tab badges
  const getCategoryCount = (key) => {
    if (key === "all") return null
    return results.filter((r) => r.media_type === key).length || null
  }

  return (
    <div className="search-page fade-in">
      {/* Inline search input */}
      <div className="search-header">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search movies, TV shows, people..."
            value={inputValue}
            onChange={handleInputChange}
            autoFocus
          />
        </div>

        {query && (
          <p className="search-summary">
            {loading && page === 1 ? "Searching..." : `Results for "${query}"`}
          </p>
        )}
      </div>

      {/* Category tabs */}
      {query && (
        <div className="search-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {!query && (
        <p className="search-empty">
          Start typing to search for movies, TV shows, and people...
        </p>
      )}

      {loading && page === 1 ? (
        <Loader count={8} />
      ) : (
        <div className="search-results-grid">
          {results.map((item, index) => {
            const isLast = results.length === index + 1
            const card =
              item.media_type === "person" ? (
                <PersonCard person={item} />
              ) : (
                <MovieCard movie={item} />
              )

            return (
              <div
                ref={isLast ? lastElementRef : null}
                key={`${item.media_type}-${item.id}`}
              >
                {card}
              </div>
            )
          })}
        </div>
      )}

      {loading && page > 1 && (
        <div className="search-loading-more">Loading more...</div>
      )}

      {!loading && query && results.length === 0 && (
        <p className="search-no-results">
          No{" "}
          {activeTab !== "all"
            ? TABS.find((t) => t.key === activeTab)?.label.toLowerCase()
            : "results"}{" "}
          found for "{query}".
        </p>
      )}
    </div>
  )
}

export default Search
