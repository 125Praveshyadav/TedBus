import api from "./api";

const getNotifications = async (params = {}) => {
  const res = await api.get("/notifications", { params });
  return res.data || res;
};

const getUnreadCount = async () => {
  const res = await api.get("/notifications/unread-count");
  return res.data || res;
};

const markAsRead = async (id) => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data || res;
};

const markAllAsRead = async () => {
  const res = await api.put("/notifications/read-all");
  return res.data || res;
};

const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data || res;
};

const deleteAllRead = async () => {
  const res = await api.delete("/notifications/read-all");
  return res.data || res;
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
};