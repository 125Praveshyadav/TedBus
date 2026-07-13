
import { Edit3, MapPin, Award } from "lucide-react";

const ProfileHeader = ({ profileData, isMyProfile }) => {
  if (!profileData) return null;

  const { user, stats, badges } = profileData;

  return (
    <div className="w-full bg-[#f3f6f8] p-6 sm:p-8 rounded-[2.5rem] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-4 border-white mb-8">
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        
        {/* AVATAR: Big & Clay */}
        <div className="relative shrink-0">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] bg-white p-2 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
            <img
              src={user.profileImage || "https://via.placeholder.com/150"}
              alt={user.name}
              className="w-full h-full object-cover rounded-[1.5rem]"
            />
          </div>
          {/* Badge Icon on Avatar */}
          {badges?.length > 0 && (
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2 rounded-xl shadow-[4px_4px_8px_#d1d9e6]">
              <Award size={20} />
            </div>
          )}
        </div>

        {/* USER INFO & INSTAGRAM-STYLE STATS */}
        <div className="flex-1 w-full text-center md:text-left">
          
          {/* Name & City */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {user.name}
            </h1>
            {user.city && (
              <p className="flex items-center justify-center md:justify-start gap-1 text-slate-500 font-medium mt-1">
                <MapPin size={16} />
                {user.city}
              </p>
            )}
          </div>

          {/* STATS GRID (Instagram Style) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-white/40 p-4 rounded-3xl shadow-[inset_2px_2px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff] mb-6 max-w-lg mx-auto md:mx-0">
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-black text-slate-800">{stats.postCount}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wide">Posts</span>
            </div>
            <div className="flex flex-col items-center border-x border-slate-300/30">
              <span className="text-xl sm:text-2xl font-black text-slate-800">{stats.commentCount}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wide">Answers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-black text-red-500">{stats.totalLikesReceived}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wide">Upvotes</span>
            </div>
          </div>

          {/* BADGES / REPUTATION PILLS */}
          {badges?.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {badges.map((badge, idx) => (
                <span key={idx} className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-black uppercase rounded-2xl shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]">
                  🏆 {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ACTION BUTTON (Edit Profile) */}
        {isMyProfile && (
          <button className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-red-500 text-white rounded-2xl font-bold shadow-[6px_6px_12px_#fca5a5,-6px_-6px_12px_#ffffff] hover:bg-red-600 active:scale-95 transition-all mt-4 md:mt-0">
            <Edit3 size={18} />
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;