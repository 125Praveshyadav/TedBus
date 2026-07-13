import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin , Edit3} from "lucide-react";
import usePosts from "../../hooks/usePosts";
import useLikes from "../../hooks/useLikes";
import PostImages from "../../components/community/PostImages";
import CommentSection from "../../components/community/CommentSection";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import SavePostButton from "../../components/community/SavePostButton";
import SharePost from "../../components/community/SharePost";
import ReportPost from "../../components/community/ReportPost";
import { useAuth } from "../../components/context/AuthContext";

const PostDetails = () => {
  const { id } = useParams();
  const { singlePost, loading, fetchPostById } = usePosts();
  const { user } = useAuth();

  useEffect(() => {
    fetchPostById(id);
  }, [id, fetchPostById]);

  // Like hook ko tabhi initialize karo jab post load ho jaye
  const { isLiked, likeCount, handleToggleLike } = useLikes(
    singlePost?.isLikedByMe,
    singlePost?.likeCount || 0
  );

  if (loading || !singlePost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Community
        </Link>

        {/* Main Post Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-6">
          
          {/* Author Info */}
          <Link to={`/community/profile/${singlePost.author?._id}`} className="flex items-center gap-3 mb-5 group w-fit">
            <img
              src={singlePost.author?.profileImage || "https://via.placeholder.com/150"}
              alt={singlePost.author?.name}
              className="w-12 h-12 rounded-2xl object-cover shadow-sm"
            />
            <div>
              <h3 className="font-black text-slate-800 group-hover:text-red-600 transition-colors">
                {singlePost.author?.name}
              </h3>
              <p className="text-xs font-medium text-slate-400">
                {formatDistanceToNow(new Date(singlePost.createdAt), { addSuffix: true })}
              </p>
            </div>
          </Link>

{user && user._id === singlePost.author?._id && (
  <Link
    to={`/community/edit-post/${singlePost._id}`}
    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all"
  >
    <Edit3 size={16} />
    Edit Post
  </Link>
)}

          {/* Title & Route */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-tight">
            {singlePost.title}
          </h1>

          {singlePost.route?.source && singlePost.route?.destination && (
            <div className="flex items-center gap-1.5 text-sm font-bold text-red-500 mb-4 bg-red-50 w-fit px-3 py-1.5 rounded-xl">
              <MapPin size={14} />
              {singlePost.route.source} ➔ {singlePost.route.destination}
            </div>
          )}

          {/* Images */}
          <PostImages images={singlePost.images} />

          {/* Content */}
          <p className="text-slate-700 leading-relaxed whitespace-pre-line mb-6">
            {singlePost.content}
          </p>

          {/* Tags */}
          {singlePost.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {singlePost.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleToggleLike(singlePost._id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all active:scale-95 ${
                isLiked
                  ? "bg-red-50 text-red-500"
                  : "bg-slate-50 text-slate-600 hover:text-red-500"
              }`}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              {likeCount} Likes
            </button>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold bg-slate-50 text-slate-600">
              <MessageCircle size={18} />
              {singlePost.commentCount} Comments
            </div>
          </div>
        </div>
        {/* Existing Like button aur Comment count ke baad */}
<SharePost postId={singlePost._id} title={singlePost.title} />

<div className="ml-auto flex items-center gap-1">
  <SavePostButton postId={singlePost._id} initialSaved={singlePost.isSaved} />
  <ReportPost targetType="Post" targetId={singlePost._id} />
</div>

        {/* Comments Section */}
        <CommentSection postId={id} />
      </div>
    </div>
  );
};

export default PostDetails;