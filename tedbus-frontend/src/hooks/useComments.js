import { useState, useCallback } from "react";
import commentService from "../services/commentService";
import { toast } from "react-toastify";

const useComments = () => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({}); // { commentId: [replies array] }
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async (postId, params = {}) => {
    setLoading(true);
    try {
      const data = await commentService.getCommentsByPost(postId, params);
      setComments(data.comments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReplies = useCallback(async (postId, commentId, params = {}) => {
    try {
      const data = await commentService.getReplies(postId, commentId, params);
      setReplies((prev) => ({ ...prev, [commentId]: data.replies }));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const addComment = async (postId, text, parentComment = null) => {
    try {
      const data = await commentService.createComment(postId, { text, parentComment });
      if (parentComment) {
        // Agar reply hai toh replies array me add karo
        setReplies((prev) => ({
          ...prev,
          [parentComment]: [...(prev[parentComment] || []), data.comment],
        }));
      } else {
        // Normal comment hai toh comments array me sabse upar
        setComments((prev) => [data.comment, ...prev]);
      }
      toast.success("Added successfully");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
      return false;
    }
  };

  return {
    comments,
    replies,
    loading,
    fetchComments,
    fetchReplies,
    addComment,
  };
};

export default useComments;