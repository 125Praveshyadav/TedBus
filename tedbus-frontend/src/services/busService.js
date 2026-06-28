import api from "./api";

const BUS_BASE = "/bus";

export const getAllBuses = async (params = {}) => {
  return api.get(`${BUS_BASE}/all`, {
    params,
  });
};

export const searchBuses = async (params) => {
  return api.get(`${BUS_BASE}/search`, {
    params,
  });
};

export const getBusById = async (busId) => {
  return api.get(`${BUS_BASE}/${busId}`);
};

export const getBusSeats = async (busId, params = {}) => {
  return api.get(`${BUS_BASE}/${busId}/seats`, {
    params,
  });
};

export const addBus = async (busData) => {
  return api.post(`${BUS_BASE}/add`, busData);
};

export const extractBuses = (response) => {
  return response?.buses || response?.data?.buses || [];
};

export const extractBus = (response) => {
  return response?.bus || response?.data?.bus || response?.data || null;
};

export const extractSeats = (response) => {
  return response?.seats || response?.data?.seats || [];
};

export const extractBookedSeats = (response) => {
  return response?.bookedSeats || response?.data?.bookedSeats || [];
};

export const busService = {
  getAllBuses,
  searchBuses,
  getBusById,
  getBusSeats,
  addBus,
  extractBuses,
  extractBus,
  extractSeats,
  extractBookedSeats,
};

export default busService;