import api from "./api";

const COUPON_BASE = "/coupon";

export const getActiveCoupons = async () => {
  return api.get(`${COUPON_BASE}/active`);
};

export const validateCoupon = async (couponData) => {
  return api.post(`${COUPON_BASE}/validate`, couponData);
};

export const couponService = {
  getActiveCoupons,
  validateCoupon,
};

export default couponService;