import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CommentInput = ({
  onSubmit,
  placeholder = "Write a comment...",
  autoFocus = false,
}) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const success = await onSubmit(text.trim());
    if (success) setText("");
    setLoading(false);
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-2xl overflow-hidden bg-red-50 dark:bg-red-900/30 border-2 border-white shadow-sm shrink-0 mt-1">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="me"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-red-600 font-black">
            {userInitial}
          </div>
        )}
      </div>

      {/* Input + Send */}
      <div className="flex-1 flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={1}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-2  border-slate-100 dark:border-slate-800 focus:border-red-400 focus:bg-white dark:bg-slate-900 outline-none rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-200 resize-none transition-colors min-h-[44px] max-h-40 overflow-y-auto"
        />

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-2xl shadow-[0_4px_12px_rgba(220,38,38,0.3)] hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </form>
  );
};

export default CommentInput;
