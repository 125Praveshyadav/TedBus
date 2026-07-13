import { useState, useEffect } from "react";
import likeService from "../services/likeService";
import { toast } from "react-toastify";

const useLikes = (initialLikedStatus = false, initialLikeCount = 0) => {
  const [isLiked, setIsLiked] = useState(initialLikedStatus);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  // Agar props change ho (jaise Post details late load ho), toh sync karo
  useEffect(() => {
    setIsLiked(initialLikedStatus);
    setLikeCount(initialLikeCount);
  }, [initialLikedStatus, initialLikeCount]);

  const handleToggleLike = async (postId = null, commentId = null) => {
    if (loading) return; // Double click prevent karo

    setLoading(true);

    // Purane state ko yaad rakho (agar error aaye toh revert kar sakein)
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic UI update
    const newLiked = !previousLiked;
    const newCount = newLiked ? previousCount + 1 : previousCount - 1;

    setIsLiked(newLiked);
    setLikeCount(newCount);

    try {
      const data = await likeService.toggleLike({ postId, commentId });

      // Backend se aaya hua actual state set karo
      if (data && typeof data.liked === "boolean") {
        setIsLiked(data.liked);
      }
    } catch (err) {
      console.error("Like error:", err);
      // Purani state pe wapas jao
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error("Failed to update like");
    } finally {
      setLoading(false);
    }
  };

  return {
    isLiked,
    likeCount,
    loading,
    handleToggleLike,
  };
};

export default useLikes;