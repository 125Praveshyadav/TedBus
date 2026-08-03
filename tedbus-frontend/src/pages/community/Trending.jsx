import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowLeft, Loader2 } from "lucide-react";
import usePosts from "../../hooks/usePosts";
import PostCard from "../../components/community/PostCard";

const Trending = () => {
  const { posts, loading, fetchPosts } = usePosts();

  useEffect(() => {
    fetchPosts({ sortBy: "trending", limit: 20 });
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Community
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 p-6 sm:p-8 rounded-[2.5rem] shadow-lg mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white dark:bg-slate-900/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Flame size={36} className="text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Trending Now</h1>
              <p className="text-white/90 mt-1 font-medium text-sm">
                Most engaging posts in the community
              </p>
            </div>
          </div>
        </div>

        {/* Posts */}
        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-red-600" size={40} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
            <Flame size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              No trending posts yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Come back later to see popular content!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post, idx) => (
              <div key={post._id} className="relative">
                {/* Ranking Badge */}
                {idx < 3 && (
                  <div className="absolute -left-2 -top-2 z-10">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${
                        idx === 0
                          ? "bg-yellow-500"
                          : idx === 1
                            ? "bg-slate-400"
                            : "bg-orange-500"
                      }`}
                    >
                      #{idx + 1}
                    </div>
                  </div>
                )}
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
