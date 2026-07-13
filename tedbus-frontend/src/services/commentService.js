import api from "./api";

const createComment = async (postId, payload) => {
  const res = await api.post(`/community/posts/${postId}/comments`, payload);
  return res.data || res;
};

const getCommentsByPost = async (postId, params = {}) => {
  const res = await api.get(`/community/posts/${postId}/comments`, { params });
  return res.data || res;
};

const getReplies = async (postId, commentId, params = {}) => {
  const res = await api.get(
    `/community/posts/${postId}/comments/${commentId}/replies`,
    { params }
  );
  return res.data || res;
};

const updateComment = async (postId, commentId, payload) => {
  const res = await api.put(
    `/community/posts/${postId}/comments/${commentId}`,
    payload
  );
  return res.data || res;
};

const deleteComment = async (postId, commentId) => {
  const res = await api.delete(
    `/community/posts/${postId}/comments/${commentId}`
  );
  return res.data || res;
};

export default {
  createComment,
  getCommentsByPost,
  getReplies,
  updateComment,
  deleteComment,
};