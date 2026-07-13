import api from "./api";

const createForum = async (payload) => {
  const res = await api.post("/community/forums", payload);
  return res.data || res;
};

const getForums = async (params = {}) => {
  const res = await api.get("/community/forums", { params });
  return res.data || res;
};

const getForumBySlug = async (slug) => {
  const res = await api.get(`/community/forums/slug/${slug}`);
  return res.data || res;
};

const getForumById = async (id) => {
  const res = await api.get(`/community/forums/${id}`);
  return res.data || res;
};

const updateForum = async (id, payload) => {
  const res = await api.put(`/community/forums/${id}`, payload);
  return res.data || res;
};

const deleteForum = async (id) => {
  const res = await api.delete(`/community/forums/${id}`);
  return res.data || res;
};

export default {
  createForum,
  getForums,
  getForumBySlug,
  getForumById,
  updateForum,
  deleteForum,
};