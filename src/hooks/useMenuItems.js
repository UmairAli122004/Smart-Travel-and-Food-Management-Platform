import { useState, useEffect, useCallback } from 'react';
import { getMenuItemsByFoodType } from '../services/menuItemService';

const useMenuItems = (foodType, initialPage = 0, size = 12) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchItems = useCallback(async (pageNum, isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      else setIsFetchingMore(true);
      
      setError(null);
      const response = await getMenuItemsByFoodType(foodType, pageNum, size);
      const newItems = response.data?.content || [];
      const totalPages = response.data?.totalPages || 0;
      
      setItems(prev => isLoadMore ? [...prev, ...newItems] : newItems);
      setHasMore(pageNum < totalPages - 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch menu items. Please try again.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [foodType, size]);

  useEffect(() => {
    if (foodType) {
      setPage(0);
      fetchItems(0);
    }
  }, [foodType, fetchItems]);

  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(nextPage, true);
  }, [page, hasMore, isFetchingMore, fetchItems]);

  const retry = useCallback(() => {
    setPage(0);
    fetchItems(0);
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    hasMore,
    isFetchingMore,
    loadMore,
    retry
  };
};

export default useMenuItems;
