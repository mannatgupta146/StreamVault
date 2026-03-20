import React, { useState, useEffect, useRef } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Search, Bell, LogOut, LogIn, Film, Tv, User, Clock, Heart } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { logout, reset } from "../features/auth/authSlice"
import { resetInteractions } from "../features/interactions/interactionsSlice"
import { useDebounce } from "../hooks/useDebounce"
import { fetchSearchResults } from "../utils/tmdb"
import "./Navbar.scss"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dropdownResults, setDropdownResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownLoading, setDropdownLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 400)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setDropdownResults([])
      setShowDropdown(false)
      return
    }

    let cancelled = false
    const fetchLive = async () => {
      try {
        setDropdownLoading(true)
        const res = await fetchSearchResults(debouncedQuery, 1)
        if (cancelled) return
        setDropdownResults(res.data.results.slice(0, 8))
        setShowDropdown(true)
      } catch {
        if (!cancelled) setDropdownResults([])
      } finally {
        if (!cancelled) setDropdownLoading(false)
      }
    }
    fetchLive()
    return () => { cancelled = true }
  }, [debouncedQuery])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowDropdown(false)
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleResultClick = (item) => {
    setShowDropdown(false)
    setSearchQuery("")
    if (item.media_type === "person") {
      navigate(`/search?q=${encodeURIComponent(item.name)}`)
    } else {
      const type = item.media_type === "tv" ? "tv" : "movie"
      navigate(`/detail/${type}/${item.id}`)
    }
  }

  const getMediaIcon = (type) => {
    if (type === "movie") return <Film size={14} />
    if (type === "tv") return <Tv size={14} />
    return <User size={14} />
  }

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    dispatch(resetInteractions())
    navigate("/")
  }

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">StreamVault</span>
        </Link>
        <ul className="navbar-links">
          <li className="nav-icon-link">
            <NavLink to="/" end>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7" />
                <path d="M9 22V12H15V22" />
              </svg>
              <span className="nav-label">Home</span>
            </NavLink>
          </li>
          <li className="nav-icon-link">
            <NavLink to="/movies">
              <Film size={22} />
              <span className="nav-label">Movies</span>
            </NavLink>
          </li>
          <li className="nav-icon-link">
            <NavLink to="/tv-shows">
              <Tv size={22} />
              <span className="nav-label">TV</span>
            </NavLink>
          </li>
          <li className="nav-icon-link">
            <NavLink to="/people">
              <User size={22} />
              <span className="nav-label">People</span>
            </NavLink>
          </li>
          {user && (
            <>
              <li className="nav-icon-link">
                <NavLink to="/library">
                  <Heart size={22} />
                  <span className="nav-label">Library</span>
                </NavLink>
              </li>
              <li className="nav-icon-link">
                <NavLink to="/watch-history">
                  <Clock size={22} />
                  <span className="nav-label">History</span>
                </NavLink>
              </li>
            </>
          )}
          {user && user.role === "admin" && (
            <li className="nav-icon-link">
              <NavLink to="/admin">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 21h13a2 2 0 0 0 2-2v-2a7 7 0 0 0-14 0v2a2 2 0 0 0 2 2z" />
                </svg>
                <span className="nav-label">Admin</span>
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      <div
        id="mobile-menu"
        className={`mobile-menu-drawer${mobileMenuOpen ? " open" : ""}`}
        aria-hidden={!mobileMenuOpen}
        tabIndex={mobileMenuOpen ? 0 : -1}
        onClick={() => setMobileMenuOpen(false)}
        style={{
          display: window.innerWidth <= 768 ? (mobileMenuOpen ? "block" : "none") : "none",
        }}
      >
        <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
          <button className="mobile-menu-close" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
            &times;
          </button>
          <ul className="mobile-menu-links">
            <li><NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>Home</NavLink></li>
            <li><NavLink to="/movies" onClick={() => setMobileMenuOpen(false)}>Movies</NavLink></li>
            <li><NavLink to="/tv-shows" onClick={() => setMobileMenuOpen(false)}>TV Shows</NavLink></li>
            <li><NavLink to="/people" onClick={() => setMobileMenuOpen(false)}>People</NavLink></li>
            {user && <li><NavLink to="/library" onClick={() => setMobileMenuOpen(false)}>Library</NavLink></li>}
            {user && <li><NavLink to="/watch-history" onClick={() => setMobileMenuOpen(false)}>History</NavLink></li>}
            {user && user.role === "admin" && (
              <li><NavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</NavLink></li>
            )}
          </ul>
          <div className="mobile-menu-user">
            {user ? (
              <button className="btn-logout" onClick={() => { onLogout(); setMobileMenuOpen(false) }}>
                <LogOut size={20} className="icon" />
                <span>{user.name}</span>
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <LogIn size={20} className="icon" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && window.innerWidth <= 768 && (
        <style>{`body { overflow: hidden !important; }`}</style>
      )}

      <div className="navbar-right">
        <div className={`search-container${mobileSearchOpen ? " mobile-search-open" : ""}`} ref={searchRef}>
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            {window.innerWidth > 768 ? (
              <>
                <Search size={20} className="icon" />
                <input
                  type="text"
                  placeholder="Movies, shows and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (dropdownResults.length > 0) setShowDropdown(true) }}
                />
              </>
            ) : (
              <>
                {!mobileSearchOpen && (
                  <button type="button" className="icon search-toggle-btn" aria-label="Open search"
                    onClick={() => setMobileSearchOpen(true)}
                    style={{ background: "none", border: 0, padding: 0, margin: 0 }}>
                    <Search size={20} />
                  </button>
                )}
                {mobileSearchOpen && (
                  <input
                    type="text"
                    placeholder="Movies, shows and more"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => setMobileSearchOpen(false)}
                    onFocus={() => { if (dropdownResults.length > 0) setShowDropdown(true) }}
                    autoFocus
                    style={{ width: "92vw", minWidth: 0, maxWidth: "92vw" }}
                  />
                )}
              </>
            )}
          </form>

          {showDropdown && (window.innerWidth > 768 || mobileSearchOpen) && (
            <div className="search-dropdown">
              {dropdownLoading ? (
                <div className="dropdown-loading">Searching...</div>
              ) : dropdownResults.length > 0 ? (
                <>
                  {dropdownResults.map((item) => {
                    const imgBase = "https://image.tmdb.org/t/p/w92"
                    const thumb = item.poster_path || item.profile_path
                      ? `${imgBase}${item.poster_path || item.profile_path}` : null
                    return (
                      <button key={`${item.media_type}-${item.id}`} className="dropdown-item" onClick={() => handleResultClick(item)}>
                        <div className="dropdown-thumb">
                          {thumb ? <img src={thumb} alt="" /> : <div className="thumb-placeholder">{getMediaIcon(item.media_type)}</div>}
                        </div>
                        <div className="dropdown-info">
                          <span className="dropdown-title">{item.title || item.name}</span>
                          <span className="dropdown-meta">
                            {getMediaIcon(item.media_type)}
                            {item.media_type === "movie" ? "Movie" : item.media_type === "tv" ? "TV Show" : "Person"}
                            {(item.release_date || item.first_air_date) && <> &middot; {(item.release_date || item.first_air_date).substring(0, 4)}</>}
                            {item.vote_average > 0 && <> &middot; {Math.round(item.vote_average * 10)}%</>}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                  <button className="dropdown-item dropdown-see-all"
                    onClick={() => { setShowDropdown(false); navigate(`/search?q=${encodeURIComponent(searchQuery)}`) }}>
                    See all results for "{searchQuery}"
                  </button>
                </>
              ) : (
                <div className="dropdown-loading">No results found</div>
              )}
            </div>
          )}
        </div>

        <Bell size={24} className="icon" />
        <div className="user-profile">
          {user ? (
            <button className="btn-logout" onClick={onLogout}
              style={{ background: "none", color: "inherit", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LogOut size={24} className="icon" />
              <span>{user.name}</span>
            </button>
          ) : (
            <Link to="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LogIn size={24} className="icon" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
