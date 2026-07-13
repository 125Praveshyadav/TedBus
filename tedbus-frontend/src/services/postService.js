import api from "./api"; // aapka path jo bhi ho yahan

const createPost = async (formData) => {
  const res = await api.post("/community/posts", formData);
  return res.data || res;
};

const getPosts = async (params = {}) => {
  const res = await api.get("/community/posts", { params });
  return res.data || res;
};

const getPostById = async (id) => {
  const res = await api.get(`/community/posts/${id}`);
  return res.data || res;
};

const updatePost = async (id, payload) => {
  const res = await api.put(`/community/posts/${id}`, payload);
  return res.data || res;
};

const deletePost = async (id) => {
  const res = await api.delete(`/community/posts/${id}`);
  return res.data || res;
};

const getMyPosts = async (params = {}) => {
  const res = await api.get("/community/posts/my-posts", { params });
  return res.data || res;
};

const getPostsByUserId = async (userId, params = {}) => {
  const res = await api.get(`/community/posts/user/${userId}`, { params });
  return res.data || res;
};

export default {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  getPostsByUserId,
};