import api from "./api";

const BOOKING_BASE = "/booking";

export const createBooking = async (bookingData) => {
  return api.post(`${BOOKING_BASE}/create`, bookingData);
};

export const getMyBookings = async () => {
  return api.get(`${BOOKING_BASE}/my-bookings`);
};

export const getSingleBooking = async (bookingId) => {
  return api.get(`${BOOKING_BASE}/${bookingId}`);
};

export const downloadTicket = async (bookingId) => {
  return api.get(`${BOOKING_BASE}/${bookingId}/download`, {
    responseType: "blob",
  });
};

export const createPaymentOrder = async (bookingId) => {
  return api.post(`${BOOKING_BASE}/create-order/${bookingId}`);
};

export const verifyPayment = async (paymentData) => {
  return api.post(`${BOOKING_BASE}/verify-payment`, paymentData);
};

export const cancelBooking = async (bookingId, cancellationReason = "") => {
  return api.put(`${BOOKING_BASE}/cancel/${bookingId}`, {
    cancellationReason,
  });
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getSingleBooking,
  downloadTicket,
  createPaymentOrder,
  verifyPayment,
  cancelBooking,
};

export default bookingService;