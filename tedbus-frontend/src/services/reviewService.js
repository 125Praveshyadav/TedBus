import api from "./api";

const createReview = async (payload) => {
  const res = await api.post("/reviews", payload);
  return res.data || res;
};

const editReview = async (id, payload) => {
  const res = await api.put(`/reviews/${id}`, payload);
  return res.data || res;
};

const getBusReviews = async (busId, params = {}) => {
  const res = await api.get(`/reviews/bus/${busId}`, { params });
  return res.data || res;
};

const checkCanReview = async (bookingId) => {
  const res = await api.get(`/reviews/check/${bookingId}`);
  return res.data || res;
};

const upvoteReview = async (id) => {
  const res = await api.post(`/reviews/${id}/upvote`);
  return res.data || res;
};

const reportReview = async (id) => {
  const res = await api.post(`/reviews/${id}/report`);
  return res.data || res;
};

const getMyReviews = async () => {
  const res = await api.get("/reviews/my-reviews");
  return res.data || res;
};

export default {
  createReview,
  editReview,
  getBusReviews,
  checkCanReview,
  upvoteReview,
  reportReview,
  getMyReviews,
};