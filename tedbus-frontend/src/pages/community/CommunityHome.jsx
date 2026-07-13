import  { useEffect } from "react";
import { Link } from "react-router-dom";
import { PenSquare, Sparkles, MessageCircle } from "lucide-react";
import usePosts from "../../hooks/usePosts";
import PostCard from "../../components/community/PostCard";
import CommunitySidebar from "../../components/community/CommunitySidebar";

const CommunityHome = () => {
  const { posts, loading, error, fetchPosts } = usePosts();

  useEffect(() => {
    // Component mount hote hi latest posts fetch karo
    fetchPosts({ sortBy: "latest" });
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-20 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header (Mobile hidden, Desktop visible) */}
        <div className="mb-6 hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Travel <span className="text-red-600">Community</span> <Sparkles className="text-yellow-500" size={24} />
            </h1>
            <p className="text-slate-500 font-medium mt-1">Share stories, ask routes, and help fellow travelers.</p>
          </div>
          <Link
            to="/community/create-post"
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-bold shadow-[0px_4px_12px_rgba(220,38,38,0.3)] hover:bg-red-700 active:scale-95 transition-all"
          >
            <PenSquare size={18} />
            Write a Post
          </Link>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Main Feed */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Mobile Create Post Input trigger */}
            <Link 
              to="/community/create-post"
              className="md:hidden flex items-center gap-3 bg-white p-4 rounded-[2rem] border-2 border-slate-100 shadow-sm active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                <PenSquare size={18} />
              </div>
              <span className="text-slate-400 font-medium">Share your travel experience...</span>
            </Link>

            {/* Feed Status */}
            {loading && posts.length === 0 && (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold">
                {error}
              </div>
            )}

            {!loading && posts.length === 0 && !error && (
              <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-slate-100 border-dashed">
                <MessageCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No posts yet</h3>
                <p className="text-slate-500">Be the first to share a travel story!</p>
              </div>
            )}

            {/* Render Posts */}
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
            
          </div>

          {/* RIGHT: Sidebar (Trending, Top Forums) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28">
              <CommunitySidebar />
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <Link
        to="/community/create-post"
        className="md:hidden fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-[0px_8px_20px_rgba(220,38,38,0.4)] active:scale-90 transition-transform"
      >
        <PenSquare size={24} />
      </Link>

    </div>
  );
};

export default CommunityHome;