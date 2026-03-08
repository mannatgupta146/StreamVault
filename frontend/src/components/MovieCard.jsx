import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addFavorite } from '../features/interactions/interactionsSlice';
import TrailerModal from './TrailerModal';
import './MovieCard.scss';

const MovieCard = ({ movie, isLargeRow }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const imgBaseUrl = "https://image.tmdb.org/t/p/w500";
  // fallback placeholders
  const backupImg = "https://via.placeholder.com/500x750?text=No+Poster";
  
  if (!movie) return null;

  const imagePath = isLargeRow ? movie.poster_path : movie.backdrop_path;
  const imageUrl = imagePath ? `${imgBaseUrl}${imagePath}` : backupImg;
  const title = movie.title || movie.name || movie.original_name;

  return (
    <>
      <div 
        className={`movie-card ${isLargeRow ? 'large' : ''} fade-in`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowModal(true)}
      >
        <img 
          src={imageUrl} 
          alt={title} 
          className="card-image"
          loading="lazy"
        />
        
        {isHovered && (
          <div className="card-hover-info">
            <div className="action-buttons">
              <button className="play-btn">
                <Play fill="currentColor" size={14} />
              </button>
              <button 
                className="icon-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(addFavorite(movie.id));
                }}
              >
                <Plus size={16} />
              </button>
              <button className="icon-btn">
                <ThumbsUp size={16} />
              </button>
              <button className="icon-btn expand-btn">
                <ChevronDown size={16} />
              </button>
            </div>
            
            <div className="metadata">
              <span className="match">{movie.vote_average ? Math.round(movie.vote_average * 10) : 'New'}% Match</span>
              <span className="rating">{movie.adult ? 'R' : 'PG-13'}</span>
              <span className="duration">{movie.release_date ? movie.release_date.substring(0,4) : ''}</span>
            </div>
            
            <ul className="genres">
              <li>{title}</li>
            </ul>
          </div>
        )}
      </div>

      {showModal && (
        <TrailerModal 
          onClose={() => setShowModal(false)} 
          movieId={movie.id} 
        />
      )}
    </>
  );
};

export default MovieCard;
