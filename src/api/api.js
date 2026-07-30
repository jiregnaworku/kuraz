import axios from "axios";

const API = axios.create({
  baseURL: "https://kuraz-backend-sin2.onrender.com/api",
});

// ===============================
// Add JWT Token Automatically
// ===============================

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // OR:
    // config.headers.Authorization = `Bearer ${JSON.parse(token)}`
    // depending on how you store it.
  }

  return config;
});

export default API;
