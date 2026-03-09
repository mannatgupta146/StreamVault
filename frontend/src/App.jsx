import React, { useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Home from "./pages/Home"
import Movies from "./pages/Movies"
import TVShows from "./pages/TVShows"
import People from "./pages/People"
import MovieDetail from "./pages/MovieDetail"
import Favorites from "./pages/Favorites"
import WatchHistory from "./pages/WatchHistory"
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"
import Navbar from "./components/Navbar"
import ErrorBoundary from "./components/ErrorBoundary"
import { getFavorites } from "./features/interactions/interactionsSlice"
import PersonCreditsPage from "./pages/PersonCreditsPage"

function AppContent() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    (location.pathname === "/admin" && (!user || user.role !== "admin"))

  // Load favorites once when user is logged in so favorite indicators work everywhere
  useEffect(() => {
    if (user) {
      dispatch(getFavorites())
    }
  }, [user, dispatch])

  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/people" element={<People />} />
          <Route
            path="/person/:personId/credits"
            element={<PersonCreditsPage />}
          />
          <Route path="/detail/:type/:id" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/watch-history" element={<WatchHistory />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}

export default App
