import React, { useState } from "react";
import { Share2, Copy, X, Check } from "lucide-react";

const SharePost = ({ postId, title }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const postUrl = `${window.location.origin}/community/post/${postId}`;
  const shareText = `Check out this post on TedBus Community: ${title}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      color: "bg-green-500",
      icon: "📱",
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + postUrl)}`,
    },
    {
      name: "X (Twitter)",
      color: "bg-slate-900",
      icon: "🐦",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "Facebook",
      color: "bg-blue-600",
      icon: "📘",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "LinkedIn",
      color: "bg-blue-700",
      icon: "💼",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-2xl font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.05)] hover:text-green-600 active:scale-95 transition-all"
      >
        <Share2 size={18} />
        <span className="hidden sm:inline text-sm">Share</span>
      </button>

      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">Share Post</h3>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowMenu(false)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  <div className={`w-12 h-12 rounded-2xl ${option.color} flex items-center justify-center text-2xl shadow-md`}>
                    {option.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-600">{option.name}</span>
                </a>
              ))}
            </div>

            {/* Copy Link */}
            <div className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={postUrl}
                readOnly
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-600 truncate"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {copied ? (
                  <span className="flex items-center gap-1">
                    <Check size={14} /> Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy size={14} /> Copy
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharePost;