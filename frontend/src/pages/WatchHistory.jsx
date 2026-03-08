import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../features/interactions/interactionsSlice';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const WatchHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { history, isLoading, isError, message } = useSelector(
    (state) => state.interactions
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/login');
    } else {
      dispatch(getHistory());
    }
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <div className="page fade-in" style={{paddingTop: '80px'}}><Loader count={4} /></div>;
  }

  return (
    <div className="page fade-in" style={{paddingTop: '100px', paddingLeft: '4rem', paddingRight: '4rem'}}>
      <h1 style={{marginBottom: '2rem'}}>Watch History</h1>
      
      {history.length > 0 ? (
        <div className="movie-grid" style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '2rem'
        }}>
          {history.map((movie) => (
            <div key={movie._id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <p>Your watch history is empty. Go watch some trailers!</p>
      )}
    </div>
  );
};

export default WatchHistory;
