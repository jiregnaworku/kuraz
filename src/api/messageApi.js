import axios from "axios";

const API_URL = "https://kuraz-backend-sin2.onrender.com/api/messages";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ==============================
// GET USER MESSAGES
// GET /api/messages
// ==============================

export const getMessages = async () => {
  const response = await axios.get(API_URL, getAuthHeader());

  return response.data;
};

// ==============================
// SEND MESSAGE
// POST /api/messages
// ==============================

export const sendMessage = async (messageData) => {
  const response = await axios.post(API_URL, messageData, getAuthHeader());

  return response.data;
};

// ==============================
// MARK MESSAGE AS READ
// PATCH /api/messages/:id/read
// ==============================

export const markMessageRead = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/read`,
    {},
    getAuthHeader(),
  );

  return response.data;
};

// ==============================
// DELETE MESSAGE
// DELETE /api/messages/:id
// ==============================

export const deleteMessage = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());

  return response.data;
};
