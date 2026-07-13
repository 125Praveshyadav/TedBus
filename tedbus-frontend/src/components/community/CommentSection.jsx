import  { useEffect, useState } from "react";
import { Send } from "lucide-react";
import useComments from "../../hooks/useComments";
import CommentCard from "./CommentCard";
import { useAuth } from "../../components/context/AuthContext";
import { toast } from "react-toastify";

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const { comments, loading, fetchComments, addComment } = useComments();
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (postId) {
      fetchComments(postId);
    }
  }, [postId, fetchComments]);

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    if (!newComment.trim()) return;

    const success = await addComment(postId, newComment);
    if (success) {
      setNewComment("");
    }
  };

  const handleReply = async (text, parentId) => {
    if (!user) {
      toast.error("Please login to reply");
      return;
    }
    await addComment(postId, text, parentId);
    toast.success("Reply added!");
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <h3 className="text-xl font-black text-slate-800 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Add New Comment Input */}
      <div className="flex items-center gap-3 mb-8 bg-slate-50 p-2 rounded-2xl border-2 border-slate-100 focus-within:border-red-300 transition-colors">
        <img
          src={user?.profileImage || "https://via.placeholder.com/150"}
          alt="You"
          className="w-9 h-9 rounded-xl object-cover shrink-0"
        />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-transparent outline-none text-sm font-medium px-2"
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
        />
        <button
          onClick={handleAddComment}
          className="bg-red-600 text-white p-2.5 rounded-xl hover:bg-red-700 active:scale-90 transition-all"
        >
          <Send size={18} />
        </button>
      </div>

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <p className="text-center text-slate-400 py-4">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-slate-400 py-4">No comments yet. Be the first!</p>
      ) : (
        <div className="flex flex-col">
          {comments.map((comment) => (
            <CommentCard key={comment._id} comment={comment} onReply={handleReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;