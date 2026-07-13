import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Grid3x3, Bookmark, MessageCircle, MapPin, Loader2, ArrowLeft } from "lucide-react";
import useProfile from "../../hooks/useProfile";
import usePosts from "../../hooks/usePosts";
import UserBadges from "../../components/profile/UserBadges";
import { useAuth } from "../../components/context/AuthContext";

const CommunityProfile = () => {
  const { id } = useParams(); // URL me userId
  const { user: currentUser } = useAuth();
  
  const { profileData, savedPosts, loading, fetchProfile, fetchSavedPosts } = useProfile();
  const { posts, fetchPosts, fetchPostsByUserId } = usePosts();

  const [activeTab, setActiveTab] = useState("posts");

  // Check if it's my own profile
  const isMyProfile = !id || id === currentUser?._id;

  useEffect(() => {
    if (isMyProfile) {
      fetchProfile("me");
    } else {
      fetchProfile(id);
    }
  }, [id, isMyProfile, fetchProfile]);

  useEffect(() => {
    if (activeTab === "saved" && isMyProfile) {
      fetchSavedPosts();
    }
  }, [activeTab, isMyProfile, fetchSavedPosts]);


  if (loading && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-bold">Profile not found</p>
      </div>
    );
  }
  
  const { user, stats, badges } = profileData;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <Link 
          to="/community" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        {/* Profile Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] bg-gradient-to-br from-red-500 to-red-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-[1.75rem] bg-white p-1">
                  <img
                    src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=fee2e2&color=dc2626&size=200`}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-[1.5rem]"
                  />
                </div>
              </div>
            </div>

            {/* Info & Stats */}
            <div className="flex-1 w-full text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {user.name}
              </h1>
              {user.city && (
                <p className="flex items-center justify-center sm:justify-start gap-1 text-slate-500 font-medium mt-1 text-sm">
                  <MapPin size={14} />
                  {user.city}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-1">Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5 bg-slate-50 p-4 rounded-2xl">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.postCount}</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Posts</p>
                </div>
                <div className="text-center border-x border-slate-200">
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.commentCount}</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Answers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-black text-red-600">{stats.totalLikesReceived}</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Upvotes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-black text-slate-800 mb-3 uppercase tracking-wider">🏆 Achievements</h3>
            <UserBadges badges={badges} />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm mb-6 flex items-center gap-1">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "posts" ? "bg-red-50 text-red-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Grid3x3 size={16} />
            <span className="hidden sm:inline">Posts</span>
          </button>
          
          {isMyProfile && (
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "saved" ? "bg-red-50 text-red-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Bookmark size={16} />
              <span className="hidden sm:inline">Saved</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("answers")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "answers" ? "bg-red-50 text-red-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <MessageCircle size={16} />
            <span className="hidden sm:inline">Answers</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm min-h-[300px]">
          {activeTab === "posts" && (
            <UserPostsGrid userId={user._id} isMyProfile={isMyProfile} />
          )}
          {activeTab === "saved" && isMyProfile && (
            <SavedPostsGrid savedPosts={savedPosts} />
          )}
          {activeTab === "answers" && (
            <div className="text-center py-16 text-slate-400 font-medium">
              <MessageCircle size={40} className="mx-auto mb-3 text-slate-300" />
              Answer history coming soon...
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Helper Component: User Posts Grid
const UserPostsGrid = ({ userId, isMyProfile }) => {
  const { posts, loading, fetchPosts, fetchMyPosts, getMyPosts } = usePosts();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      if (isMyProfile) {
        await fetchPosts({ author: userId }); 
      } else {
        // Simple filter fetch for now
        await fetchPosts({ author: userId });
      }
    };
    loadPosts();
  }, [userId, isMyProfile]);

  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-red-600" /></div>;
  
  const displayPosts = posts.filter(p => p.author?._id === userId);

  if (displayPosts.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 font-medium">
        <Grid3x3 size={40} className="mx-auto mb-3 text-slate-300" />
        No posts yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {displayPosts.map((post) => (
        <Link 
          key={post._id} 
          to={`/community/post/${post._id}`}
          className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative group"
        >
          {post.images?.[0]?.url ? (
            <img src={post.images[0].url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-3 bg-gradient-to-br from-red-50 to-red-100">
              <p className="text-xs font-bold text-red-600 line-clamp-4 text-center">{post.title}</p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

// Helper Component: Saved Posts Grid
const SavedPostsGrid = ({ savedPosts }) => {
  if (!savedPosts || savedPosts.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 font-medium">
        <Bookmark size={40} className="mx-auto mb-3 text-slate-300" />
        No saved posts yet. Bookmark posts to see them here!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {savedPosts.map((saved) => (
        saved.post && (
          <Link 
            key={saved._id} 
            to={`/community/post/${saved.post._id}`}
            className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative group"
          >
            {saved.post.images?.[0]?.url ? (
              <img src={saved.post.images[0].url} alt={saved.post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-3 bg-gradient-to-br from-red-50 to-red-100">
                <p className="text-xs font-bold text-red-600 line-clamp-4 text-center">{saved.post.title}</p>
              </div>
            )}
          </Link>
        )
      ))}
    </div>
  );
};

export default CommunityProfile;