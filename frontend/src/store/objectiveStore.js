import { create } from "zustand";
import {
  createObjective,
  deleteObjective,
  getObjectives,
  updateObjective,
} from "../api/objectives";

const useObjectiveStore = create((set) => ({
  objectives: [],
  loading: false,

  loadObjectives: async () => {
    set({ loading: true });

    try {
      const objectives = await getObjectives();

      set({
        objectives,
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
    await createObjective(data);
  },

  updateObjective: async (
    id,
    data
  ) => {
    await updateObjective(id, data);
  },

  deleteObjective: async (id) => {
    await deleteObjective(id);
  },
}));

export default useObjectiveStore;
