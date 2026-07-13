import api from "./api";

const getUserCommunityProfile = async (id) => {
  const res = await api.get(`/community/profile/${id}`);
  return res.data || res;
};

const getMyCommunityProfile = async () => {
  const res = await api.get("/community/profile/me");
  return res.data || res;
};

const toggleSavePost = async (postId) => {
  const res = await api.post(`/community/profile/save/${postId}`);
  return res.data || res;
};

const getSavedPosts = async (params = {}) => {
  const res = await api.get("/community/profile/saved-posts", { params });
  return res.data || res;
};

const getLeaderboard = async (params = {}) => {
  const res = await api.get("/community/profile/leaderboard", { params });
  return res.data || res;
};

export default {
  getUserCommunityProfile,
  getMyCommunityProfile,
  toggleSavePost,
  getSavedPosts,
  getLeaderboard,
};