import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Eye,
  MessageCircle,
  Send,
  Loader2,
  Pin,
  Lock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import useDiscussions from "../../hooks/useDiscussions";
import ReplyCard from "../../components/forum/ReplyCard";
import discussionService from "../../services/discussionService";
import { useAuth } from "../../components/context/AuthContext";
import { toast } from "react-toastify";

const DiscussionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { singleDiscussion, fetchDiscussionById, loading } = useDiscussions();

  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscussionById(id);
    loadReplies();
  }, [id]);

  const loadReplies = async () => {
    try {
      const data = await discussionService.getRepliesByDiscussion(id);
      setReplies(data?.replies || []);
    } catch (err) {
      console.error("Failed to load replies:", err);
    }
  };

  const handleAddReply = async (text = null, parentReply = null) => {
    const replyText = text || newReply;
    if (!user) return toast.error("Please login to reply");
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await discussionService.createReply(id, {
        text: replyText,
        parentReply: parentReply || null,
      });
      toast.success(parentReply ? "Reply added!" : "Answer posted!");
      if (!parentReply) setNewReply("");
      loadReplies();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkBest = async (replyId) => {
    try {
      await discussionService.markBestAnswer(id, replyId);
      toast.success("Marked as best answer!");
      loadReplies();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark best answer");
    }
  };

  if (loading || !singleDiscussion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  const isDiscussionAuthor = user?._id === singleDiscussion.author?._id;
  const topLevelReplies = replies.filter((r) => !r.parentReply);
  const bestAnswer = replies.find((r) => r.isBestAnswer);
  const otherReplies = topLevelReplies.filter((r) => !r.isBestAnswer);

  const getNestedReplies = (parentId) =>
    replies.filter((r) => r.parentReply === parentId);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to={`/community/forums/${singleDiscussion.forum?.slug || ""}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Forum
        </Link>

        {/* Discussion Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-6">
          {/* Badges */}
          {(singleDiscussion.isPinned || singleDiscussion.isClosed) && (
            <div className="flex items-center gap-2 mb-4">
              {singleDiscussion.isPinned && (
                <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                  <Pin size={12} /> Pinned
                </span>
              )}
              {singleDiscussion.isClosed && (
                <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  <Lock size={12} /> Closed
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 leading-tight">
            {singleDiscussion.title}
          </h1>

          {/* Route */}
          {singleDiscussion.route?.source && singleDiscussion.route?.destination && (
            <div className="inline-flex items-center gap-1.5 text-sm font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl mb-4">
              <MapPin size={14} />
              {singleDiscussion.route.source} → {singleDiscussion.route.destination}
            </div>
          )}

          {/* Content */}
          <p className="text-slate-700 leading-relaxed whitespace-pre-line mb-6">
            {singleDiscussion.content}
          </p>

          {/* Tags */}
          {singleDiscussion.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {singleDiscussion.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author & Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Link
              to={`/community/profile/${singleDiscussion.author?._id}`}
              className="flex items-center gap-3 group"
            >
              <img
                src={
                  singleDiscussion.author?.profileImage ||
                  `https://ui-avatars.com/api/?name=${singleDiscussion.author?.name}&background=fee2e2&color=dc2626`
                }
                alt={singleDiscussion.author?.name}
                className="w-10 h-10 rounded-xl object-cover shadow-sm"
              />
              <div>
                <p className="font-black text-slate-800 group-hover:text-red-600 transition-colors text-sm">
                  {singleDiscussion.author?.name}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {formatDistanceToNow(new Date(singleDiscussion.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {singleDiscussion.views || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={14} />
                {replies.length}
              </span>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-6">
          <h2 className="text-xl font-black text-slate-800 mb-6">
            {replies.length} {replies.length === 1 ? "Answer" : "Answers"}
          </h2>

          {/* Best Answer (if exists) */}
          {bestAnswer && (
            <div className="mb-6">
              <ReplyCard
                reply={bestAnswer}
                isBestAnswer={true}
                onReply={handleAddReply}
                canMarkBest={isDiscussionAuthor}
                onMarkBest={handleMarkBest}
              />
              {/* Nested replies of best answer */}
              {getNestedReplies(bestAnswer._id).map((nested) => (
                <ReplyCard
                  key={nested._id}
                  reply={nested}
                  isNested={true}
                  onReply={handleAddReply}
                />
              ))}
            </div>
          )}

          {/* Other Replies */}
          {otherReplies.length === 0 && !bestAnswer ? (
            <div className="text-center py-10">
              <MessageCircle size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-400 font-medium">No answers yet. Be the first!</p>
            </div>
          ) : (
            otherReplies.map((reply) => (
              <div key={reply._id}>
                <ReplyCard
                  reply={reply}
                  onReply={handleAddReply}
                  canMarkBest={isDiscussionAuthor}
                  onMarkBest={handleMarkBest}
                />
                {/* Nested replies */}
                {getNestedReplies(reply._id).map((nested) => (
                  <ReplyCard
                    key={nested._id}
                    reply={nested}
                    isNested={true}
                    onReply={handleAddReply}
                  />
                ))}
              </div>
            ))
          )}
        </div>

        {/* Add Reply Box */}
        {user && !singleDiscussion.isClosed && (
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky bottom-4">
            <h3 className="font-black text-slate-800 mb-3">Your Answer</h3>
            <div className="flex gap-3">
              <img
                src={
                  user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${user.name}&background=fee2e2&color=dc2626`
                }
                alt="You"
                className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm"
              />
              <div className="flex-1">
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Share your knowledge or experience..."
                  rows="3"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white transition-colors outline-none font-medium resize-none text-sm"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => handleAddReply()}
                    disabled={submitting || !newReply.trim()}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-2xl font-bold shadow-[0px_4px_12px_rgba(220,38,38,0.3)] hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                    Post Answer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {singleDiscussion.isClosed && (
          <div className="bg-slate-100 p-4 rounded-2xl text-center text-slate-600 font-bold text-sm flex items-center justify-center gap-2">
            <Lock size={16} />
            This discussion is closed for new replies
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionDetails;