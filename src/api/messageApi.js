import axios from "axios";

const API_URL = "http://localhost:5000/api/messages";

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
// ==============================

export const getMessages = async () => {
  const response = await axios.get(API_URL, getAuthHeader());

  return response.data;
};

// ==============================
// SEND MESSAGE TO ADMIN
// ==============================

export const sendMessage = async (messageData) => {
  const response = await axios.post(API_URL, messageData, getAuthHeader());

  return response.data;
};

// ==============================
// MARK MESSAGE AS READ
// ==============================

export const markMessageRead = async (id) => {
  const response = await axios.put(
    `${API_URL}/${id}/read`,
    {},
    getAuthHeader(),
  );

  return response.data;
};

// ==============================
// DELETE MESSAGE
// ==============================

export const deleteMessage = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());

  return response.data;
};
