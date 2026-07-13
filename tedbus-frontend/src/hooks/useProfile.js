import { useState, useCallback } from "react";
import profileService from "../services/profileService";
import { toast } from "react-toastify";

const useProfile = () => {
  const [profileData, setProfileData] = useState(null); // User info, stats, badges
  const [savedPosts, setSavedPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Apni ya kisi aur ki profile fetch karna (Instagram style stats yahi se aayenge)
 const fetchProfile = useCallback(async (userId = "me") => {
  setLoading(true);
  try {
    let data;
    if (userId === "me") {
      data = await profileService.getMyCommunityProfile();
    } else {
      data = await profileService.getUserCommunityProfile(userId);
    }

    // Safety check: agar data missing hai, error throw karo
    if (!data || !data.user) {
      throw new Error("Profile data not received");
    }

    setProfileData(data);
    setError(null);
  } catch (err) {
    console.error("Profile fetch error:", err);
    setError(err.response?.data?.message || err.message || "Failed to fetch profile");
  } finally {
    setLoading(false);
  }
}, []);

  // 2. Saved Posts lana (Bookmark tab ke liye)
  const fetchSavedPosts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await profileService.getSavedPosts(params);
      setSavedPosts(data.savedPosts);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load saved posts");
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Post save/unsave toggle karna
  const toggleSave = async (postId) => {
    try {
      const data = await profileService.toggleSavePost(postId);
      toast.success(data.message);
      return data.saved; // return true/false status
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save post");
      return null;
    }
  };

  // 4. Top users list lana (Leaderboard page ke liye)
  const fetchLeaderboard = useCallback(async (limit = 10) => {
    setLoading(true);
    try {
      const data = await profileService.getLeaderboard({ limit });
      setLeaderboard(data.leaderboard);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profileData,
    savedPosts,
    leaderboard,
    loading,
    error,
    fetchProfile,
    fetchSavedPosts,
    toggleSave,
    fetchLeaderboard,
  };
};

export default useProfile;