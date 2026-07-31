import axios from "axios";

const API_URL = "https://kuraz-backend-sin2.onrender.com/api/profile";
//const API_URL = "http://localhost:5000/api/profile";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ==============================
// GET USER PROFILE
// ==============================

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}`, getAuthHeader());

  return response.data;
};

// ==============================
// UPDATE PROFILE
// ==============================

export const updateProfile = async (data) => {
  const response = await axios.put(`${API_URL}`, data, getAuthHeader());

  return response.data;
};

// ==============================
// DELETE PROFILE
// ==============================

export const deleteProfile = async () => {
  const response = await axios.delete(`${API_URL}`, getAuthHeader());

  return response.data;
};

// ==============================
// CHANGE PASSWORD
// ==============================

export const changePassword = async (data) => {
  const response = await axios.put(
    `${API_URL}/password`,
    data,
    getAuthHeader(),
  );

  return response.data;
};
