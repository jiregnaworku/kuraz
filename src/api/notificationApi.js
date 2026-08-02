import axios from "axios";

const API_URL = "https://kuraz-backend-sin2.onrender.com/api/notifications";
//const API_URL = "http://localhost:5000/api/notifications";

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
// MARK ALL AS READ - FIXED
// ==============================

export const markAllAsRead = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    // FIXED: Use /read-all instead of /mark-all-read
    const response = await axios.put(
      `${API_URL}/read-all`, // Changed from /mark-all-read to /read-all
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error marking all as read:", error);
    throw error;
  }
};
// ==============================
// DELETE NOTIFICATION
// ==============================

export const deleteNotification = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};
