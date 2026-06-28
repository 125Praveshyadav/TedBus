import api from "./api";

/**
 * Backend route assumptions based on your route files:
 *
 * app.use("/api/v1/auth", authRoutes)
 * app.use("/api/v1/users", userRoutes)
 *
 * If your app.js uses "/api/v1/user", change USER_BASE to "/user".
 */

const AUTH_BASE = "/auth";
const USER_BASE = "/users";

// ---------------- AUTH ----------------

export const registerUser = async (userData) => {
  return api.post(`${AUTH_BASE}/register`, userData);
};

export const verifyOTP = async (otpData) => {
  return api.post(`${AUTH_BASE}/verify-otp`, otpData);
};

export const loginUser = async (userData) => {
  return api.post(`${AUTH_BASE}/login`, userData);
};

export const forgotPassword = async (emailData) => {
  return api.post(`${AUTH_BASE}/forgot-password`, emailData);
};

export const verifyResetOTP = async (otpData) => {
  return api.post(`${AUTH_BASE}/verify-reset-otp`, otpData);
};

export const resetPassword = async (passwordData) => {
  return api.post(`${AUTH_BASE}/reset-password`, passwordData);
};

export const logoutUser = async () => {
  return api.get(`${AUTH_BASE}/logout`);
};

// ---------------- USER PROFILE ----------------

export const getProfile = async () => {
  return api.get(`${USER_BASE}/profile`);
};

export const updateProfile = async (profileData) => {
  return api.put(`${USER_BASE}/update-profile`, profileData);
};

export const changePassword = async (passwordData) => {
  return api.put(`${USER_BASE}/change-password`, passwordData);
};

export const updateProfilePhoto = async (formData) => {
  return api.put(`${USER_BASE}/profile-photo`, formData);
};

// ---------------- RESPONSE HELPERS ----------------

export const normalizeAuthResponse = (response) => {
  const root = response || {};
  const data = root.data || root;

  return {
    token:
      data.token ||
      data.accessToken ||
      root.token ||
      root.accessToken ||
      data?.data?.token ||
      data?.data?.accessToken ||
      null,

    user:
      data.user ||
      root.user ||
      data?.data?.user ||
      data?.loggedInUser ||
      root?.loggedInUser ||
      null,
  };
};

export const extractUser = (response) => {
  const root = response || {};
  const data = root.data || root;

  return (
    data.user ||
    root.user ||
    data?.data?.user ||
    data?.profile ||
    root.profile ||
    data?.data ||
    null
  );
};

export const authService = {
  register: registerUser,
  verifyOTP,
  login: loginUser,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  logout: logoutUser,

  getProfile,
  getCurrentUser: getProfile,
  updateProfile,
  changePassword,
updateProfilePhoto,
  normalizeAuthResponse,
  extractUser,
};

export default authService;