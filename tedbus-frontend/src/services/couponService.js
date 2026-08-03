import api from "./api";

const COUPON_BASE = "/coupon";

export const getActiveCoupons = async () => {
  const res = await api.get(`${COUPON_BASE}/active`);
  return res?.data !== undefined ? res.data : res;
};

export const validateCoupon = async (code, amount) => {
  const res = await api.post(`${COUPON_BASE}/validate`, {
    code: String(code).trim().toUpperCase(),
    amount: Number(amount) || 0,
  });

  return res?.data !== undefined ? res.data : res;
};

export const applyCoupon = async (code, amount) => {
  return validateCoupon(code, amount);
};

export const couponService = {
  getActiveCoupons,
  validateCoupon,
  applyCoupon,
};

export default couponService;