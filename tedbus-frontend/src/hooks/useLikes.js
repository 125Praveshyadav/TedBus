import { useState, useEffect } from "react";
import likeService from "../services/likeService";
import { toast } from "react-toastify";

const useLikes = (initialLikedStatus = false, initialLikeCount = 0) => {
  const [isLiked, setIsLiked] = useState(initialLikedStatus);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLiked(initialLikedStatus);
    setLikeCount(initialLikeCount);
  }, [initialLikedStatus, initialLikeCount]);

  const handleToggleLike = async (postId = null, commentId = null) => {
    if (loading) return;

    // 1. Backup current state
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // 2. Optimistic UI update (Turant badlaav)
    const newLiked = !previousLiked;
    const newCount = newLiked ? previousCount + 1 : Math.max(0, previousCount - 1);

    setIsLiked(newLiked);
    setLikeCount(newCount);

    try {
      setLoading(true);
      const res = await likeService.toggleLike({ postId, commentId });

      // 🔑 Safety Check: Kuch setups mein res.data hota hai, kuch mein direct res
      const data = res?.data !== undefined ? res.data : res;

      if (data && typeof data.liked === "boolean") {
        setIsLiked(data.liked);
        // 🔔 Server se naya count le lo agar available hai
        if (data.likeCount !== undefined) {
          setLikeCount(data.likeCount);
        }
      }
    } catch (err) {
      // 3. Rollback: Agar fail hua toh purana state wapas
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      
      console.error("Like error detail:", err.response?.data || err.message);
      
      // Toast message server se lo agar available hai
      const errMsg = err.response?.data?.message || "Failed to update like";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { isLiked, likeCount, loading, handleToggleLike };
};

export default useLikes;