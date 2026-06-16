import api from "./axios";

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");

  return response.data;
};


export const getAgenda = async () => {
  const response = await api.get("/dashboard/agenda");

  return response.data;
};
