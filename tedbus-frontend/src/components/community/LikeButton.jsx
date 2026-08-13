import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import useLikes from "../../hooks/useLikes";   // ← Hook use kiya
import { toast } from "react-hot-toast";

const LikeButton = ({ 
  postId = null, 
  commentId = null, 
  initialLiked = false, 
  initialCount = 0,
  size = "md",
  showCount = true,
  onLikeChange = null,
}) => {
  const { isLiked, likeCount, isLoading, isAnimating, toggleLike } = useLikes(
    initialLiked, 
    initialCount
  );

  const handleClick = useCallback(async () => {
    await toggleLike(postId, commentId);
    
    if (onLikeChange) {
      onLikeChange({ liked: isLiked, count: likeCount });
    }
  }, [toggleLike, postId, commentId, onLikeChange, isLiked, likeCount]);

  const sizeConfig = {
    sm: { icon: "h-4 w-4", text: "text-xs", gap: "gap-1", padding: "px-2 py-1" },
    md: { icon: "h-5 w-5", text: "text-sm", gap: "gap-1.5", padding: "px-3 py-1.5" },
    lg: { icon: "h-6 w-6", text: "text-base", gap: "gap-2", padding: "px-4 py-2" },
  };

  const cfg = sizeConfig[size] || sizeConfig.md;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center ${cfg.gap} ${cfg.padding} rounded-lg font-semibold
        transition-all duration-200 select-none
        ${isLiked 
          ? "text-red-600 bg-red-50 hover:bg-red-100" 
          : "text-slate-600 hover:bg-slate-100 hover:text-red-600"
        }
        ${isLoading ? "opacity-70 cursor-wait" : "cursor-pointer"}
        active:scale-95
      `}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <Heart
        className={`
          ${cfg.icon} transition-all duration-300
          ${isLiked ? "fill-red-600 text-red-600" : "fill-transparent"}
          ${isAnimating ? "scale-125" : "scale-100"}
        `}
        strokeWidth={isLiked ? 2 : 2}
      />
      {showCount && (
        <span className={`${cfg.text} tabular-nums`}>
          {likeCount}
        </span>
      )}
    </button>
  );
};

export default LikeButton;