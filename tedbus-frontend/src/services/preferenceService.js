import api from "./api";

const getPreferences = async () => {
  const res = await api.get("/notifications/preferences");
  return res.data || res;
};

const updatePreferences = async (data) => {
  const res = await api.put("/notifications/preferences", data);
  return res.data || res;
};

export default {
  getPreferences,
  updatePreferences,
};