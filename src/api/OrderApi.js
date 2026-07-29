import API from "./api";

// ===============================
// Create Order
// ===============================

export const createOrder = async (data) => {
  const response = await API.post("/orders", data);

  return response.data;
};

// ===============================
// Get My Orders (Customer)
// ===============================

export const getMyOrders = async () => {
  const response = await API.get("/orders/my-orders");

  return response.data.orders;
};

// ===============================
// Get All Orders (Admin)
// ===============================

export const getOrders = async () => {
  const response = await API.get("/orders");

  return response.data.orders;
};

// ===============================
// Get Single Order (Admin)
// ===============================

export const getOrder = async (id) => {
  const response = await API.get(`/orders/${id}`);

  return response.data.order;
};

// ===============================
// Update Order Status (Admin)
// ===============================

export const updateOrderStatus = async (id, data) => {
  const response = await API.patch(`/orders/${id}/status`, data);

  return response.data;
};

// ===============================
// Delete Order (Admin)
// ===============================

export const deleteOrder = async (id) => {
  const response = await API.delete(`/orders/${id}`);

  return response.data;
};
