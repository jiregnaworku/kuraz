import axios from "axios";

const API_URL = "https://kuraz-backend-sin2.onrender.com/api/notifications";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ==============================
// GET USER NOTIFICATIONS
// ==============================

export const getNotifications = async () => {
  const response = await axios.get(API_URL, getAuthHeader());

  return response.data;
};

// ==============================
// MARK NOTIFICATION READ
// ==============================

export const markNotificationRead = async (id) => {
  const response = await axios.put(
    `${API_URL}/${id}/read`,
    {},
    getAuthHeader(),
  );

  return response.data;
};

// ==============================
// DELETE NOTIFICATION
// ==============================

export const deleteNotification = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());

  return response.data;
};
