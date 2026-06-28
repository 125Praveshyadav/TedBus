import api from "./api";

const REVIEW_BASE = "/reviews";

export const createReview = async (reviewData) => {
  return api.post(`${REVIEW_BASE}`, reviewData);
};

export const getBusReviews = async (busId) => {
  return api.get(`${REVIEW_BASE}/bus/${busId}`);
};

export const getMyReviews = async () => {
  return api.get(`${REVIEW_BASE}/my-reviews`);
};

export const reviewService = {
  createReview,
  getBusReviews,
  getMyReviews,
};

export default reviewService;