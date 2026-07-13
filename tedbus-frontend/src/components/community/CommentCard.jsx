import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, CornerDownRight, ChevronDown, ChevronUp } from "lucide-react";
import useComments from "../../hooks/useComments";
import CommentInput from "./CommentInput";

const CommentCard = ({ comment, postId }) => {
  const { replies, fetchReplies, addComment } = useComments();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [repliesLoaded, setRepliesLoaded] = useState(false);

  const commentReplies = replies[comment._id] || [];

  const handleShowReplies = async () => {
    if (!repliesLoaded) {
      await fetchReplies(postId, comment._id);
      setRepliesLoaded(true);
    }
    setRepliesVisible((prev) => !prev);
  };

  const handleAddReply = async (text) => {
    const success = await addComment(postId, text, comment._id);
    if (success) {
      await fetchReplies(postId, comment._id);
      setRepliesLoaded(true);
      setRepliesVisible(true);
    }
    setShowReplyInput(false);
    return success;
  };

  const authorInitial = comment.author?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-2xl overflow-hidden bg-red-50 border-2 border-white shadow-sm shrink-0 mt-1">
        {comment.author?.profileImage ? (
          <img src={comment.author.profileImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-red-600 font-black">
            {authorInitial}
          </div>
        )}
      </div>

      <div className="flex-1">
        {/* Comment Bubble */}
        <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] rounded-tl-md px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-black text-slate-800 text-sm">
              {comment.author?.name}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {comment.text}
          </p>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-4 mt-2 pl-2">
          <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
            <Heart size={13} />
            {comment.likeCount > 0 && comment.likeCount}
          </button>

          <button
            onClick={() => setShowReplyInput((prev) => !prev)}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
          >
            <CornerDownRight size={13} />
            Reply
          </button>

          {comment.commentCount > 0 || commentReplies.length > 0 ? (
            <button
              onClick={handleShowReplies}
              className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              {repliesVisible ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {repliesVisible ? "Hide replies" : `View replies`}
            </button>
          ) : null}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-3 pl-2">
            <CommentInput
              onSubmit={handleAddReply}
              placeholder={`Reply to ${comment.author?.name}...`}
              autoFocus
            />
          </div>
        )}

        {/* Replies List */}
        {repliesVisible && commentReplies.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-red-100 flex flex-col gap-3">
            {commentReplies.map((reply) => (
              <div key={reply._id} className="flex gap-3">
                <div className="w-8 h-8 rounded-xl overflow-hidden bg-red-50 shrink-0">
                  {reply.author?.profileImage ? (
                    <img src={reply.author.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-red-600 font-black text-xs">
                      {reply.author?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-white border border-slate-100 rounded-[1.25rem] rounded-tl-md px-4 py-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-800 text-xs">
                        {reply.author?.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{reply.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;