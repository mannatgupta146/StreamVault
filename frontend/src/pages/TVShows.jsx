import React, { useState, useEffect } from 'react';
import MovieRow from '../components/MovieRow';
import HeroBanner from '../components/HeroBanner';
import Loader from '../components/Loader';
import { fetchNetflixOriginals, fetchTrendingTV, fetchTopRatedTV, fetchPopularTV } from '../utils/tmdb';

const TVShows = () => {
  const [originals, setOriginals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [originalsRes, trendingRes, topRatedRes, popularRes] = await Promise.all([
          fetchNetflixOriginals(),
          fetchTrendingTV(),
          fetchTopRatedTV(),
          fetchPopularTV()
        ]);

        setOriginals(originalsRes.data.results);
        setTrending(trendingRes.data.results);
        setTopRated(topRatedRes.data.results);
        setPopular(popularRes.data.results);
      } catch (error) {
        console.error("Error fetching TV shows from TMDB", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="page fade-in" style={{paddingTop: '80px'}}><Loader count={12} /></div>;

  return (
    <div className="tv-shows fade-in">
      {/* Pick random header image */}
      <HeroBanner movie={originals[Math.floor(Math.random() * originals.length)]} />
      
      <div className="rows-container" style={{ marginTop: '-100px', position: 'relative', zIndex: 10 }}>
        <MovieRow title="StreamVault Originals" movies={originals} isLargeRow />
        <MovieRow title="Trending TV Shows" movies={trending} />
        <MovieRow title="Top Rated TV" movies={topRated} />
        <MovieRow title="Popular Now" movies={popular} />
      </div>
    </div>
  );
};

export default TVShows;
