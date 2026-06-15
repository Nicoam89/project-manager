import api from "./axios";

export const getGoals = async () => {
  const response = await api.get("/goals");

  return response.data;
};

export const getGoalDetails = async (id) => {
  const response = await api.get(`/goals/${id}/details`);

  return response.data;
};

export const createGoal = async (data) => {
  const response = await api.post("/goals", data);

  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await api.delete(`/goals/${id}`);

  return response.data;
};
