import api from "./axios";

export const getObjectives = async () => {
  const response = await api.get("/objectives");

  return response.data;
};

export const getObjectiveDetails = async (id) => {
  const response = await api.get(`/objectives/${id}/details`);

  return response.data;
};

export const createObjective = async (data) => {
  const response = await api.post("/objectives", data);

  return response.data;
};

export const updateObjective = async (id, data) => {
  const response = await api.put(`/objectives/${id}`, data);

  return response.data;
};

export const deleteObjective = async (id) => {
  const response = await api.delete(`/objectives/${id}`);

  return response.data;
};
