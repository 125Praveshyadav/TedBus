import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");

  return axios.put(
    `${API}/users/profile`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};