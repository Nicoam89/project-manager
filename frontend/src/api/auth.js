import api from "./axios";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};


export const updateProfile = async (profile) => {
  const response = await api.put("/auth/profile", profile);

  return response.data;
};
