import api from "./api";

const saveRoute = async (payload) => {
  const res = await api.post("/route-planner/save", payload);
  return res.data || res;
};

const getMyRoutes = async () => {
  const res = await api.get("/route-planner/my-routes");
  return res.data || res;
};

const markUsed = async (id) => {
  const res = await api.put(`/route-planner/${id}/use`);
  return res.data || res;
};

const deleteRoute = async (id) => {
  const res = await api.delete(`/route-planner/${id}`);
  return res.data || res;
};

export default { saveRoute, getMyRoutes, markUsed, deleteRoute };