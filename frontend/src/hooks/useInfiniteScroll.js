import { useState, useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (callback) => {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef(null);

  const lastElementRef = useCallback((node) => {
    if (isFetching) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsFetching(true);
      }
    });

    if (node) observer.current.observe(node);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    
    // Execute the callback function when scrolled to bottom
    Promise.resolve(callback()).finally(() => {
      setIsFetching(false);
    });

  }, [isFetching, callback]);

  return [lastElementRef, isFetching, setIsFetching];
};
