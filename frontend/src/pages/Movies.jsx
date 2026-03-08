import React, { useState, useEffect } from 'react';
import MovieRow from '../components/MovieRow';
import HeroBanner from '../components/HeroBanner';
import Loader from '../components/Loader';
import { fetchRomanceMovies, fetchHorrorMovies, fetchComedyMovies, fetchTrending } from '../utils/tmdb';

const Movies = () => {
  const [trending, setTrending] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [horror, setHorror] = useState([]);
  const [romance, setRomance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, comedyRes, horrorRes, romanceRes] = await Promise.all([
          fetchTrending(),
          fetchComedyMovies(),
          fetchHorrorMovies(),
          fetchRomanceMovies()
        ]);

        // filter trending to only show movies
        const movieTrending = trendingRes.data.results.filter(item => item.media_type === 'movie' || !item.media_type);

        setTrending(movieTrending);
        setComedy(comedyRes.data.results);
        setHorror(horrorRes.data.results);
        setRomance(romanceRes.data.results);
      } catch (error) {
        console.error("Error fetching movies from TMDB", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="page fade-in" style={{paddingTop: '80px'}}><Loader count={12} /></div>;

  return (
    <div className="movies fade-in">
      {/* Pick random header image */}
      <HeroBanner movie={trending[Math.floor(Math.random() * trending.length)]} />
      
      <div className="rows-container" style={{ marginTop: '-100px', position: 'relative', zIndex: 10 }}>
        <MovieRow title="Trending Movies" movies={trending} isLargeRow />
        <MovieRow title="Comedy Movies" movies={comedy} />
        <MovieRow title="Horror Movies" movies={horror} />
        <MovieRow title="Romance Movies" movies={romance} />
      </div>
    </div>
  );
};

export default Movies;
