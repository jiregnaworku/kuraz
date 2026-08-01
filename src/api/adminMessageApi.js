import axios from "axios";

//const API_URL = "https://kuraz-backend-sin2.onrender.com/api/messages";
const API_URL = "http://localhost:5000/api/messages";

const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Admin conversation list

export const getAdminConversations = async () => {
  const response = await axios.get(
    `${API_URL}/admin/conversations`,

    authHeader(),
  );

  return response.data;
};

// Open chat

export const getConversation = async (userId) => {
  const response = await axios.get(
    `${API_URL}/conversation/${userId}`,

    authHeader(),
  );

  return response.data;
};

// Admin reply

export const sendAdminMessage = async (data) => {
  const response = await axios.post(API_URL, data, authHeader());

  return response.data;
};
