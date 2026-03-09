import React, { useState, useEffect } from "react"
import axios from "axios"
import HeroBanner from "../components/HeroBanner"
import MovieRow from "../components/MovieRow"
import Loader from "../components/Loader"
import {
  fetchTrending,
  fetchNetflixOriginals,
  fetchTopRated,
  fetchActionMovies,
  fetchPopularMovies,
} from "../utils/tmdb"

const Home = () => {
  const [trending, setTrending] = useState([])
  const [originals, setOriginals] = useState([])
  const [topRated, setTopRated] = useState([])
  const [action, setAction] = useState([])
  const [popular, setPopular] = useState([])
  const [customMovies, setCustomMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customResPromise = axios.get((import.meta.env.VITE_API_URL || "") + "/api/movies").catch(() => ({ data: [] }));
        
        const [trendingRes, originalsRes, topRatedRes, actionRes, popularRes, customRes] =
          await Promise.all([
            fetchTrending(),
            fetchNetflixOriginals(),
            fetchTopRated(),
            fetchActionMovies(),
            fetchPopularMovies(),
            customResPromise
          ])

        setTrending(trendingRes.data.results)
        setOriginals(originalsRes.data.results)
        setTopRated(topRatedRes.data.results)
        setAction(actionRes.data.results)
        setPopular(popularRes.data.results)
        if (customRes && customRes.data) {
          setCustomMovies(customRes.data)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading)
    return (
      <div className="page fade-in" style={{ paddingTop: "80px" }}>
        <Loader count={12} />
      </div>
    )

  return (
    <div className="home fade-in">
      <HeroBanner
        movie={trending[Math.floor(Math.random() * trending.length)]}
      />

      <div
        className="rows-container"
        style={{ position: "relative", zIndex: 10, marginTop: "-100px" }}
      >
        {customMovies.length > 0 && (
          <MovieRow title="StreamVault Exclusives" movies={customMovies} isLargeRow />
        )}
        <MovieRow title="StreamVault Originals" movies={originals} isLargeRow={customMovies.length === 0} />
        <MovieRow title="Trending Now" movies={trending} />
        <MovieRow title="Popular" movies={popular} />
        <MovieRow title="Top Rated" movies={topRated} />
        <MovieRow title="Action Thrillers" movies={action} />
      </div>
    </div>
  )
}

export default Home
