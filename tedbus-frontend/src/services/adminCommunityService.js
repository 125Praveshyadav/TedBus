import api from "./api";

const getStats = async () => {
  const res = await api.get("/admin/community/stats");
  return res.data || res;
};

const getPendingContent = async () => {
  const res = await api.get("/admin/community/pending");
  return res.data || res;
};

const updatePostStatus = async (id, status) => {
  const res = await api.put(`/admin/community/posts/${id}/status`, { status });
  return res.data || res;
};

const updateDiscussionStatus = async (id, status) => {
  const res = await api.put(`/admin/community/discussions/${id}/status`, { status });
  return res.data || res;
};

export default {
  getStats,
  getPendingContent,
  updatePostStatus,
  updateDiscussionStatus,
};