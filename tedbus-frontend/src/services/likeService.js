import api from "./api";

const toggleLike = async (payload) => {
  const res = await api.post("/community/likes/toggle", payload);
  return res.data || res;
};

const getLikesByPost = async (postId, params = {}) => {
  const res = await api.get(`/community/likes/post/${postId}`, { params });
  return res.data || res;
};

const checkUserLiked = async (params) => {
  const res = await api.get("/community/likes/check", { params });
  return res.data || res;
};

export default { toggleLike, getLikesByPost, checkUserLiked };