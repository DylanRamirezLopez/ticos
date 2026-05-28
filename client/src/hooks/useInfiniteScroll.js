import { useState, useEffect, useCallback, useRef } from 'react';

const useInfiniteScroll = (fetchFn, options = {}) => {
  const { threshold = 200, initialPage = 1 } = options;
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const result = await fetchFn(page);
      if (page === 1) {
        setItems(result.data);
      } else {
        setItems((prev) => [...prev, ...result.data]);
      }
      setHasMore(result.hasMore);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [fetchFn, page, hasMore]);

  useEffect(() => {
    loadMore();
  }, [page]);

  const nextPage = useCallback(() => {
    if (!loading && hasMore) {
      setPage((p) => p + 1);
    }
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
  }, []);

  return { items, loading, hasMore, nextPage, refresh, setItems };
};

export default useInfiniteScroll;
