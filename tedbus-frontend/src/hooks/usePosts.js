import { useState, useCallback } from "react";
import postService from "../services/postService";
import { toast } from "react-toastify";

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [singlePost, setSinglePost] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await postService.getPosts(params);
      // Agar 'page > 1' hai toh purane posts me naye add karo (Load More logic)
      setPosts((prev) => params.page > 1 ? [...prev, ...data.posts] : data.posts);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await postService.getPostById(id);
      setSinglePost(data.post);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Post not found");
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewPost = async (formData) => {
    setLoading(true);
    try {
      const data = await postService.createPost(formData);
      setPosts((prev) => [data.post, ...prev]); // Naya post sabse upar
      toast.success("Post created successfully!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingPost = async (id) => {
    try {
      await postService.deletePost(id);
      setPosts((prev) => prev.filter((post) => post._id !== id));
      toast.success("Post deleted");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
      return false;
    }
  };

  return {
    posts,
    singlePost,
    pagination,
    loading,
    error,
    fetchPosts,
    fetchPostById,
    createNewPost,
    deleteExistingPost,
  };
};

export default usePosts;