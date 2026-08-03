import { Star } from "lucide-react";
import { useState } from "react";

const StarRating = ({
  rating = 0,
  onRate = null,
  size = "md",
  readonly = false,
}) => {
  const [hovered, setHovered] = useState(0);

  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const iconSize = sizeMap[size] || sizeMap.md;
  const display = hovered || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform ${
            !readonly ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"
          }`}
        >
          <Star
            className={`${iconSize} transition-colors ${
              star <= display
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-slate-300 dark:text-slate-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;