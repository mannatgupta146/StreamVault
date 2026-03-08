import React from 'react';
import './Loader.scss';

const Loader = ({ count = 5 }) => {
  return (
    <div className="loader-container fade-in">
      <div className="skeleton-title skeleton-shimmer"></div>
      <div className="skeleton-row">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card skeleton-shimmer"></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
