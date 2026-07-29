import API from "./api";

// Signup

export const signup = async (data) => {
  const response = await API.post("/auth/signup", data);

  return response.data;
};

// Login

export const signin = async (data) => {
  const response = await API.post("/auth/login", data);

  return response.data;
};
