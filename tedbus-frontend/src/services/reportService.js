import api from "./api";

const createReport = async (payload) => {
  const { data } = await api.post("/community/reports", payload);
  return data;
};

const getReports = async (params = {}) => {
  const { data } = await api.get("/community/reports", { params });
  return data;
};

const updateReportStatus = async (id, status) => {
  const { data } = await api.put(`/community/reports/${id}/status`, { status });
  return data;
};

const removeReportedContent = async (id) => {
  const { data } = await api.delete(`/community/reports/${id}/remove-content`);
  return data;
};

export default {
  createReport,
  getReports,
  updateReportStatus,
  removeReportedContent,
};