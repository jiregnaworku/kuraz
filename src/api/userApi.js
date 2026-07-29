import API from "./api";

// ===============================
// Get All Users
// ===============================

export const getUsers = async () => {
  const response = await API.get("/users");

  return response.data;
};

// ===============================
// Get Single User
// ===============================

export const getUserById = async (id) => {
  const response = await API.get(`/users/${id}`);

  return response.data;
};

// ===============================
// Update User
// ===============================

export const updateUser = async (id, data) => {
  const response = await API.put(`/users/${id}`, data);

  return response.data;
};

// ===============================
// Block / Unblock User
// ===============================

export const blockUser = async (id) => {
  const response = await API.patch(`/users/${id}/block`);

  return response.data;
};

// ===============================
// Delete User
// ===============================

export const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);

  return response.data;
};
