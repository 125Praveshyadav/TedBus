import { useState, useEffect, useCallback } from "react";
import postService from "../services/postService";

const usePosts = (filters = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

   const fetchPosts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await postService.getPosts(params);
      
      // Safety Check: Ensure data.posts exists, otherwise use empty array
      const newPosts = data?.posts || [];
      const newPagination = data?.pagination || {};

      // Agar 'page > 1' hai toh purane posts me naye add karo (Load More)
      setPosts((prev) => (params.page > 1 ? [...prev, ...newPosts] : newPosts));
      setPagination(newPagination);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { 
    posts, 
    loading, 
    error, 
    pagination, 
    refetch: fetchPosts 
  };
};

export default usePosts;