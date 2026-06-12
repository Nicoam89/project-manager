import { create } from "zustand";

import api from "../api/axios";

const getStoredToken = () =>
  localStorage.getItem("token") || null;

const normalizeUser = (user) => ({
  id: user._id || user.id,
  name: user.name,
  email: user.email,
});

const useAuthStore = create((set, get) => ({
  user: null,

  token: getStoredToken(),

  loading: false,

  initialized: false,

  login: (user, token) => {
    localStorage.setItem(
      "token",
      token
    );

    set({
      user,
      token,
      initialized: true,
    });
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      loading: false,
      initialized: true,
    });
  },

  loadMe: async () => {
    const token = get().token || getStoredToken();

    if (!token) {
      set({
        user: null,
        token: null,
        loading: false,
        initialized: true,
      });

      return null;
    }

    set({
      loading: true,
      token,
    });

    try {
      const response = await api.get(
        "/auth/me"
      );

      const user = normalizeUser(
        response.data
      );

      set({
        user,
        token,
        loading: false,
        initialized: true,
      });

      return user;
    } catch (error) {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        loading: false,
        initialized: true,
      });

      throw error;
    }
  },
}));

export default useAuthStore;
