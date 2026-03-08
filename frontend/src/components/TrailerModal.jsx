import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToHistory } from '../features/interactions/interactionsSlice';
import tmdbAxios from '../utils/tmdb';
import './TrailerModal.scss';

const TrailerModal = ({ onClose, movieId }) => {
  const [trailerUrl, setTrailerUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!movieId) return;

    // Trigger watch history save
    dispatch(addToHistory(movieId));

    const fetchTrailer = async () => {
      try {
        setLoading(true);
        // We use movie/ or tv/ depending on where it came from, 
        // a robust app would distinguish them. Assuming Movie for now:
        const request = await tmdbAxios.get(`/movie/${movieId}/videos?language=en-US`);
        // Find the first YouTube video that is a Trailer
        const trailer = request.data.results.find(
          (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
        );
        
        if (trailer) {
          setTrailerUrl(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching trailer", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [movieId]);

  // Handle clicking outside the modal content
  const handleBackdropClick = (e) => {
    if (e.target.className && typeof e.target.className === 'string' && e.target.className.includes('trailer-modal-backdrop')) {
      onClose();
    }
  };

  return (
    <div className="trailer-modal-backdrop fade-in" onClick={handleBackdropClick}>
      <div className="trailer-modal-content zoom-in">
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={30} />
        </button>
        <div className="video-container">
          {loading ? (
             <div style={{color: '#fff', textAlign: 'center', paddingTop: '10%'}}>Loading Trailer...</div>
          ) : trailerUrl ? (
             <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
             <div className="no-trailer">
                <h3>No Trailer Available</h3>
                <p>We couldn't find a video for this selection.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
