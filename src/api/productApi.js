import API from "./api";

// ===============================
// Get All Products
// ===============================

export const getProducts = async (params = {}) => {
  const response = await API.get("/products", {
    params,
  });

  return response.data.products;
};

// ===============================
// Get Single Product
// ===============================

export const getProduct = async (id) => {
  const response = await API.get(`/products/${id}`);

  return response.data.product;
};

// ===============================
// Create Product
// ===============================

export const createProduct = async (formData) => {
  const response = await API.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ===============================
// Update Product
// ===============================

export const updateProduct = async (id, formData) => {
  const response = await API.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ===============================
// Delete Product
// ===============================

export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);

  return response.data;
};
