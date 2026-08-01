import axios from "axios";

const API_URL = "https://kuraz-backend-sin2.onrender.com/api/comments";
//const API_URL = "http://localhost:5000/api/comments";

const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Added for safety
    },
  };
};

// ===============================
// Get Product Comments
// ===============================

export const getComments = async (productId) => {
  const response = await axios.get(`${API_URL}/${productId}`);

  return response.data;
};

// ===============================
// Add Comment
// ===============================

export const addComment = async (productId, commentText) => {
  const response = await axios.post(
    `${API_URL}/${productId}`,
    {
      message: commentText, // ⚠️ FIXED: Backend schema requires 'message', not 'comment'
    },
    authHeader(),
  );

  return response.data;
};

// ===============================
// Delete Comment
// ===============================

export const deleteComment = async (commentId) => {
  const response = await axios.delete(`${API_URL}/${commentId}`, authHeader());

  return response.data;
};

// ===============================
// Hide / Unhide Comment (Admin)
// ===============================

export const toggleCommentVisibility = async (commentId) => {
  const response = await axios.patch(
    `${API_URL}/${commentId}/hide`,
    {},
    authHeader(),
  );

  return response.data;
};
