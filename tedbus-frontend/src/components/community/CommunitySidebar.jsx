import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  MessageSquare,
  Trophy,
  PenSquare,
  Users,
  Bookmark,
  TrendingUp,
  ChevronRight,
  Award,
  Sparkles,
} from "lucide-react";
import useForums from "../../hooks/useForums";
import useProfile from "../../hooks/useProfile";
import usePosts from "../../hooks/usePosts";

const CommunitySidebar = () => {
  const { forums, fetchForums } = useForums();
  const { leaderboard, fetchLeaderboard } = useProfile();
  const { posts: trendingPosts, fetchPosts } = usePosts();
  const [activeTab, setActiveTab] = useState("trending"); // trending | forums | leaders

  useEffect(() => {
    fetchForums({ limit: 5 });
    fetchLeaderboard(5);
    fetchPosts({ sortBy: "trending", limit: 5 });
  }, [fetchForums, fetchLeaderboard, fetchPosts]);

  return (
    <div className="flex flex-col gap-5">
      {/* ⚡ Quick Actions Card */}
      <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-5 rounded-[2rem] shadow-xl shadow-red-500/20 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

        <div className="relative">
          <h3 className="text-lg font-black flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-yellow-300" fill="currentColor" />
            Quick Actions
          </h3>
          <p className="text-xs text-white/80 font-medium mb-4">Get started in seconds</p>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/community/create-post"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all active:scale-95"
            >
              <PenSquare size={20} />
              <span className="text-[11px] font-black">New Post</span>
            </Link>
            <Link
              to="/community/forums"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all active:scale-95"
            >
              <MessageSquare size={20} />
              <span className="text-[11px] font-black">Forums</span>
            </Link>
            <Link
              to="/community/profile/me"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all active:scale-95"
            >
              <Users size={20} />
              <span className="text-[11px] font-black">My Profile</span>
            </Link>
            <Link
              to="/community/profile/me"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all active:scale-95"
            >
              <Bookmark size={20} />
              <span className="text-[11px] font-black">Saved</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 🔥 Tabbed Content Card */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex bg-slate-50 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab("trending")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === "trending"
                ? "bg-white text-red-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Flame size={14} fill={activeTab === "trending" ? "currentColor" : "none"} />
            Trending
          </button>
          <button
            onClick={() => setActiveTab("forums")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === "forums"
                ? "bg-white text-red-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <MessageSquare size={14} />
            Forums
          </button>
          <button
            onClick={() => setActiveTab("leaders")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === "leaders"
                ? "bg-white text-red-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Trophy size={14} />
            Leaders
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {/* TRENDING */}
          {activeTab === "trending" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" fill="currentColor" />
                  Hot Posts
                </h3>
                <Link
                  to="/community/trending"
                  className="text-[10px] font-black text-red-600 hover:text-red-700 uppercase tracking-wider"
                >
                  See all
                </Link>
              </div>

              {trendingPosts.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium text-center py-4">
                  No trending posts yet
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {trendingPosts.slice(0, 4).map((post, idx) => (
                    <Link
                      key={post._id}
                      to={`/community/post/${post._id}`}
                      className="group flex items-start gap-3"
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
                          idx === 0
                            ? "bg-yellow-100 text-yellow-700"
                            : idx === 1
                            ? "bg-slate-100 text-slate-600"
                            : idx === 2
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-0.5">
                            <TrendingUp size={10} /> {post.likeCount || 0}
                          </span>
                          <span>•</span>
                          <span>{post.commentCount || 0} comments</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* FORUMS */}
          {activeTab === "forums" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <MessageSquare size={16} className="text-red-500" />
                  Popular Forums
                </h3>
                <Link
                  to="/community/forums"
                  className="text-[10px] font-black text-red-600 hover:text-red-700 uppercase tracking-wider"
                >
                  Explore
                </Link>
              </div>

              {forums.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium text-center py-4">
                  No forums available
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {forums.slice(0, 5).map((forum) => (
                    <Link
                      key={forum._id}
                      to={`/community/forums/${forum.slug || forum._id}`}
                      className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-lg shrink-0">
                        {forum.icon || "💬"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-700 group-hover:text-red-600 transition-colors truncate">
                          {forum.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {forum.discussionCount || 0} discussions
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-slate-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all shrink-0"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* LEADERBOARD */}
          {activeTab === "leaders" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Trophy size={16} className="text-yellow-500" fill="currentColor" />
                  Top Contributors
                </h3>
                <Link
                  to="/community/leaderboard"
                  className="text-[10px] font-black text-red-600 hover:text-red-700 uppercase tracking-wider"
                >
                  Full list
                </Link>
              </div>

              {leaderboard.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium text-center py-4">
                  No contributors yet
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {leaderboard.slice(0, 5).map((entry, idx) => (
                    <Link
                      key={entry._id}
                      to={`/community/profile/${entry._id}`}
                      className="group flex items-center gap-3"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={
                            entry.user?.profileImage ||
                            `https://ui-avatars.com/api/?name=${entry.user?.name}&background=fee2e2&color=dc2626`
                          }
                          alt={entry.user?.name}
                          className="w-9 h-9 rounded-xl object-cover shadow-sm border-2 border-white"
                        />
                        {idx < 3 && (
                          <div
                            className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-sm ${
                              idx === 0
                                ? "bg-yellow-500"
                                : idx === 1
                                ? "bg-slate-400"
                                : "bg-orange-500"
                            }`}
                          >
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-700 group-hover:text-red-600 transition-colors truncate">
                          {entry.user?.name || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-medium">
                          <span>{entry.totalPosts} posts</span>
                          <span>•</span>
                          <span>{entry.totalLikes} likes</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-red-600">{entry.score}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">pts</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 🏆 Achievement Banner */}
      <Link
        to="/community/leaderboard"
        className="group relative bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-[2rem] shadow-lg text-white overflow-hidden hover:shadow-2xl transition-shadow"
      >
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-yellow-500/20 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 shrink-0">
            <Award size={28} className="text-white" fill="currentColor" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-sm">Earn Badges</h4>
            <p className="text-[11px] text-white/70 font-medium mt-0.5 leading-tight">
              Post more, help others & climb the ranks
            </p>
          </div>
          <ChevronRight
            size={18}
            className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0"
          />
        </div>
      </Link>

      {/* 📋 Community Rules Mini Card */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
          Community Guidelines
        </p>
        <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
          <li className="flex items-start gap-2">
            <span className="text-red-500 shrink-0">✓</span>
            <span>Be respectful & helpful</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 shrink-0">✓</span>
            <span>Share real travel experiences</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 shrink-0">✓</span>
            <span>No spam or self-promotion</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommunitySidebar;