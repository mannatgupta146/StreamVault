import React, { useState, useEffect } from "react"
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, originalsRes, topRatedRes, actionRes, popularRes] =
          await Promise.all([
            fetchTrending(),
            fetchNetflixOriginals(),
            fetchTopRated(),
            fetchActionMovies(),
            fetchPopularMovies(),
          ])

        setTrending(trendingRes.data.results)
        setOriginals(originalsRes.data.results)
        setTopRated(topRatedRes.data.results)
        setAction(actionRes.data.results)
        setPopular(popularRes.data.results)
      } catch (error) {
        console.error("Error fetching data from TMDB", error)
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
        style={{ marginTop: "-100px", position: "relative", zIndex: 10 }}
      >
        <MovieRow title="StreamVault Originals" movies={originals} isLargeRow />
        <MovieRow title="Trending Now" movies={trending} />
        <MovieRow title="Popular" movies={popular} />
        <MovieRow title="Top Rated" movies={topRated} />
        <MovieRow title="Action Thrillers" movies={action} />
      </div>
    </div>
  )
}

export default Home
