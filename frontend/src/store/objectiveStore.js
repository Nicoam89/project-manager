import { create } from "zustand";
import api from "../api/axios";

const useObjectiveStore = create((set) => ({
  objectives: [],
  loading: false,

  loadObjectives: async () => {
    set({ loading: true });

    try {
      const response = await api.get(
        "/objectives"
      );

      set({
        objectives: response.data,
        loading: false,
      });
    } catch (error) {
      console.error(error);

      set({
        loading: false,
      });
    }
  },

  createObjective: async (data) => {
    await api.post(
      "/objectives",
      data
    );
  },

  updateObjective: async (
    id,
    data
  ) => {
    await api.put(
      `/objectives/${id}`,
      data
    );
  },

  deleteObjective: async (id) => {
    await api.delete(
      `/objectives/${id}`
    );
  },
}));

export default useObjectiveStore;