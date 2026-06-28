import api from "./api";

export const createOrder = (
  bookingId
) =>
  api.post(
    `/booking/create-order/${bookingId}`
  );

export const verifyPayment = (
  paymentData
) =>
  api.post(
    "/booking/verify-payment",
    paymentData
  );