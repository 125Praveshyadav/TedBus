import api from "./api";

const ADMIN_BASE = "/admin";

export const adminService = {
  getDashboard: () => api.get(`${ADMIN_BASE}/dashboard`),

  getBuses: () => api.get(`${ADMIN_BASE}/buses`),
  addBus: (data) => api.post(`${ADMIN_BASE}/bus`, data),
  updateBus: (id, data) => api.put(`${ADMIN_BASE}/bus/${id}`, data),
  deleteBus: (id) => api.delete(`${ADMIN_BASE}/bus/${id}`),

  getRoutes: () => api.get(`${ADMIN_BASE}/routes`),
  addRoute: (data) => api.post(`${ADMIN_BASE}/route`, data),
  updateRoute: (id, data) => api.put(`${ADMIN_BASE}/route/${id}`, data),
  deleteRoute: (id) => api.delete(`${ADMIN_BASE}/route/${id}`),

  getBookings: () => api.get(`${ADMIN_BASE}/bookings`),
  updateBooking: (id, data) => api.put(`${ADMIN_BASE}/booking/${id}`, data),

  getUsers: () => api.get(`${ADMIN_BASE}/users`),
  updateUser: (id, data) => api.put(`${ADMIN_BASE}/user/${id}`, data),
  deleteUser: (id) => api.delete(`${ADMIN_BASE}/user/${id}`),



getCoupons: () => api.get(`${ADMIN_BASE}/coupons`),

createCoupon: (data) => api.post(`${ADMIN_BASE}/coupon`, data),

updateCoupon: (id, data) => api.put(`${ADMIN_BASE}/coupon/${id}`, data),

deleteCoupon: (id) => api.delete(`${ADMIN_BASE}/coupon/${id}`),


  getReports: (params = {}) =>
  api.get(`${ADMIN_BASE}/reports`, {
    params,
  }),

  getPayments: () => api.get(`${ADMIN_BASE}/payments`),

  getReviews: () => api.get(`${ADMIN_BASE}/reviews`),
  deleteReview: (id) => api.delete(`${ADMIN_BASE}/review/${id}`),

  getSettings: () => api.get(`${ADMIN_BASE}/settings`),
  updateSettings: (data) => api.put(`${ADMIN_BASE}/settings`, data),

  getAdminProfile: () => api.get(`${ADMIN_BASE}/profile`),

updateAdminProfile: (data) => api.put(`${ADMIN_BASE}/profile`, data),

updateAdminProfilePhoto: (formData) =>
  api.put(`${ADMIN_BASE}/profile/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

changeAdminPassword: (data) =>
  api.put(`${ADMIN_BASE}/profile/change-password`, data),
};

export default adminService;