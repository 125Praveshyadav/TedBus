import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, ArrowLeft, Loader2 } from "lucide-react";
import useProfile from "../../hooks/useProfile";
import LeaderboardTable from "../../components/profile/LeaderboardTable";

const Leaderboard = () => {
  const { leaderboard, loading, fetchLeaderboard } = useProfile();

  useEffect(() => {
    fetchLeaderboard(20);
  }, [fetchLeaderboard]);

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

        {/* Header */}
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-6 sm:p-8 rounded-[2.5rem] shadow-lg mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Trophy size={36} className="text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Leaderboard</h1>
              <p className="text-white/90 mt-1 font-medium text-sm">
                Top contributors of TedBus Community
              </p>
            </div>
          </div>

          {/* Score Legend */}
          <div className="mt-5 pt-5 border-t border-white/20 grid grid-cols-3 gap-3 text-center text-xs">
            <div>
              <p className="text-white/80 font-medium">Post</p>
              <p className="font-black text-lg">+1</p>
            </div>
            <div className="border-x border-white/20">
              <p className="text-white/80 font-medium">Like Received</p>
              <p className="font-black text-lg">+1</p>
            </div>
            <div>
              <p className="text-white/80 font-medium">Comment</p>
              <p className="font-black text-lg">+2</p>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-red-600" size={40} />
          </div>
        ) : (
          <LeaderboardTable users={leaderboard} />
        )}
      </div>
    </div>
  );
};

export default Leaderboard;