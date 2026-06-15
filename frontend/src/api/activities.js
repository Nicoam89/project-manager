import api from "./axios";

export const getActivities = async (params) => {
  const response = await api.get("/activities", { params });

  return response.data;
};

export const getActivityDetails = async (id) => {
  const response = await api.get(`/activities/${id}/details`);

  return response.data;
};

export const createActivity = async (data) => {
  const response = await api.post("/activities", data);

  return response.data;
};

export const updateActivity = async (id, data) => {
  const response = await api.put(`/activities/${id}`, data);

  return response.data;
};

export const updateActivityStatus = async (id, status) => {
  const response = await api.patch(`/activities/${id}/status`, { status });

  return response.data;
};

export const addActivityTime = async (id, data) => {
  const response = await api.post(`/activities/${id}/time`, data);

  return response.data;
};

export const deleteActivity = async (id) => {
  const response = await api.delete(`/activities/${id}`);

  return response.data;
};
