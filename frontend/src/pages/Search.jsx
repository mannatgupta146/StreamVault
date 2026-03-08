import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import PersonCard from '../components/PersonCard';
import Loader from '../components/Loader';
import { fetchSearchResults } from '../utils/tmdb';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDebounce } from '../hooks/useDebounce';

const Search = () => {
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const query = useDebounce(rawQuery, 500); // 500ms debounce
  
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Reset state when query changes
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  // Fetch data when query or page changes
  useEffect(() => {
    if (!query) return;

    const loadResults = async () => {
      try {
        if(page === 1) setLoading(true);
        const res = await fetchSearchResults(query, page);
        
        const fetchedResults = res.data.results;
        
        setResults(prev => page === 1 ? fetchedResults : [...prev, ...fetchedResults]);
        setHasMore(res.data.page < res.data.total_pages);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [query, page]);

  const loadMoreData = async () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const [lastElementRef] = useInfiniteScroll(loadMoreData);

  return (
    <div className="page fade-in" style={{paddingTop: '100px', paddingLeft: '4rem', paddingRight: '4rem'}}>
      <h1 style={{marginBottom: '2rem'}}>Search Results for "{query}"</h1>
      
      {!query && <p>Type something in the search bar above...</p>}
      
      {loading && page === 1 ? (
        <Loader count={8} />
      ) : (
        <div className="movie-grid" style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '2rem'
        }}>
          {results.map((item, index) => {
            const isLastElement = results.length === index + 1;
            
            let cardComponent;
            if (item.media_type === 'person') {
              cardComponent = <PersonCard person={item} />;
            } else {
              cardComponent = <MovieCard movie={item} />;
            }
            
            return (
              <div ref={isLastElement ? lastElementRef : null} key={item.id}>
                {cardComponent}
              </div>
            );
          })}
        </div>
      )}

      {loading && page > 1 && <div style={{textAlign: 'center', margin: '2rem 0'}}><p>Loading more...</p></div>}
      
      {!loading && query && results.length === 0 && (
        <p>No results found for "{query}".</p>
      )}
    </div>
  );
};

export default Search;
