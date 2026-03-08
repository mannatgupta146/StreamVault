import React from 'react';
import { Play, Info } from 'lucide-react';
import './HeroBanner.scss';

const HeroBanner = ({ movie }) => {
  if (!movie) {
    return (
      <header className="hero-banner fade-in" style={{ backgroundColor: '#111' }}>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to StreamVault</h1>
          <h1 className="hero-description">
            Please configure your TMDB API Key in <code>src/utils/tmdb.js</code> to load real movie data.
          </h1>
        </div>
        <div className="hero-fade-bottom" />
      </header>
    );
  }

  // TMDB image base URL
  const imgBaseUrl = "https://image.tmdb.org/t/p/original";
  
  const title = movie?.title || movie?.name || movie?.original_name;
  
  // Truncate long descriptions
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <header 
      className="hero-banner fade-in"
      style={{
        backgroundImage: `url("${imgBaseUrl}${movie?.backdrop_path}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">
          {title}
        </h1>
        <div className="hero-buttons">
          <button className="btn btn-play">
            <Play fill="currentColor" size={20} />
            Play
          </button>
          <button className="btn btn-info">
            <Info size={20} />
            More Info
          </button>
        </div>
        <h1 className="hero-description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>
      
      <div className="hero-fade-bottom" />
    </header>
  );
};

export default HeroBanner;
