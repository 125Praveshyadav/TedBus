import PostImages from "./PostImages";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, MapPin } from "lucide-react";
import useLikes from "../../hooks/useLikes";
import { formatDistanceToNow } from "date-fns"; // time formatting ke liye (install date-fns if not have)
import SavePostButton from "./SavePostButton";
import SharePost from "./SharePost";
import ReportPost from "./ReportPost";

const PostCard = ({ post }) => {
  // Hook se real-time like handle hoga
  const { isLiked, likeCount, handleToggleLike } = useLikes(
    post.isLikedByMe, // Backend se aayega ki user ne like kiya hai ya nahi
    post.likeCount
  );

  return (
    <div className="w-full bg-[#f3f6f8] p-4 sm:p-6 rounded-[2rem] shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] border-2 border-white/60 mb-6 transition-transform duration-300 hover:-translate-y-1">
      
      {/* HEADER: Author & Time */}
      <div className="flex items-center justify-between mb-4">
        <Link to={`/community/profile/${post.author?._id}`} className="flex items-center gap-3 group">
          {/* Avatar with Clay effect */}
          <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]">
            <img
              src={post.author?.profileImage || "https://via.placeholder.com/150"}
              alt={post.author?.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 group-hover:text-red-600 transition-colors">
              {post.author?.name}
            </h3>
            <p className="text-xs font-medium text-slate-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </Link>

        {/* Post Type Badge */}
        <span className="px-3 py-1 bg-white/50 text-slate-500 text-xs font-bold uppercase rounded-full shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff]">
          {post.postType}
        </span>
      </div>

      {/* BODY: Title, Content & Route */}
      <Link to={`/community/post/${post._id}`} className="block mb-4">
        <h2 className="text-lg sm:text-xl font-black text-slate-800 mb-2 leading-tight">
          {post.title}
        </h2>
        
        {post.route?.source && post.route?.destination && (
          <div className="flex items-center gap-1 text-sm font-semibold text-red-500 mb-2 bg-red-50 w-fit px-3 py-1 rounded-xl">
            <MapPin size={14} />
            {post.route.source} ➔ {post.route.destination}
          </div>
        )}
          <PostImages images={post.images} />

        <p className="text-sm sm:text-base text-slate-600 line-clamp-3">
          {post.content}
        </p>
      </Link>

      

      {/* TAGS */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl shadow-[inset_1px_1px_3px_#d1d9e6,inset_-1px_-1px_3px_#ffffff]">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* FOOTER: Actions (Clay Buttons) */}
<div className="flex items-center gap-2 sm:gap-3 pt-3 border-t border-slate-200/50">
  
  {/* Like Button */}
  <button
    onClick={() => handleToggleLike(post._id)}
    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold transition-all active:scale-95 ${
      isLiked
        ? "bg-red-50 text-red-500"
        : "bg-white text-slate-600 shadow-[2px_2px_6px_rgba(0,0,0,0.05)] hover:text-red-500"
    }`}
  >
    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
    <span className="text-sm">{likeCount}</span>
  </button>

  {/* Comment Button */}
  <Link
    to={`/community/post/${post._id}`}
    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-2xl font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.05)] hover:text-blue-500 active:scale-95 transition-all"
  >
    <MessageCircle size={18} />
    <span className="text-sm">{post.commentCount}</span>
  </Link>

  {/* Share Button */}
  <SharePost postId={post._id} title={post.title} />

  {/* Right side: Save + Report */}
  <div className="ml-auto flex items-center gap-1">
    <SavePostButton postId={post._id} initialSaved={post.isSaved} />
    <ReportPost targetType="Post" targetId={post._id} />
  </div>
</div>

    </div>
  );
};

export default PostCard;