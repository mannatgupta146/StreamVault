import React, { useState, useEffect } from 'react';
import { fetchTrendingMovies } from '../utils/tmdb';
import './AuthBackground.scss';

const AuthBackground = () => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const { data } = await fetchTrendingMovies();
        if (data && data.results) {
          const paths = data.results
            .map(movie => movie.backdrop_path)
            .filter(Boolean);
          setBackgrounds(paths);
        }
      } catch (error) {
        console.error('Error fetching trending movies for background:', error);
      }
    };
    getMovies();
  }, []);

  useEffect(() => {
    if (backgrounds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 10000); // Rotate every 10 seconds
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  if (backgrounds.length === 0) {
    return <div className="auth-dynamic-bg-container fallback"></div>;
  }

  return (
    <div className="auth-dynamic-bg-container">
      {backgrounds.map((bg, index) => {
        const isCurrent = index === currentIndex;
        return (
          <div
            key={bg}
            className={`auth-dynamic-bg-layer ${isCurrent ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url('https://image.tmdb.org/t/p/original${bg}')`
            }}
          />
        );
      })}
    </div>
  );
};

export default AuthBackground;
