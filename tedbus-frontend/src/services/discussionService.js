import api from "./api";

const createDiscussion = async (forumId, payload) => {
  const res = await api.post(`/community/discussions/forum/${forumId}`, payload);
  return res.data || res;
};

const getDiscussionsByForum = async (forumId, params = {}) => {
  const res = await api.get(`/community/discussions/forum/${forumId}`, { params });
  return res.data || res;
};

const getDiscussionById = async (id) => {
  const res = await api.get(`/community/discussions/${id}`);
  return res.data || res;
};

const updateDiscussion = async (id, payload) => {
  const res = await api.put(`/community/discussions/${id}`, payload);
  return res.data || res;
};

const deleteDiscussion = async (id) => {
  const res = await api.delete(`/community/discussions/${id}`);
  return res.data || res;
};

const createReply = async (discussionId, payload) => {
  const res = await api.post(`/community/discussions/${discussionId}/replies`, payload);
  return res.data || res;
};

const getRepliesByDiscussion = async (discussionId, params = {}) => {
  const res = await api.get(`/community/discussions/${discussionId}/replies`, { params });
  return res.data || res;
};

const updateReply = async (replyId, payload) => {
  const res = await api.put(`/community/discussions/replies/${replyId}`, payload);
  return res.data || res;
};

const deleteReply = async (replyId) => {
  const res = await api.delete(`/community/discussions/replies/${replyId}`);
  return res.data || res;
};

const markBestAnswer = async (discussionId, replyId) => {
  const res = await api.put(`/community/discussions/${discussionId}/replies/${replyId}/best-answer`);
  return res.data || res;
};

export default {
  createDiscussion,
  getDiscussionsByForum,
  getDiscussionById,
  updateDiscussion,
  deleteDiscussion,
  createReply,
  getRepliesByDiscussion,
  updateReply,
  deleteReply,
  markBestAnswer,
};