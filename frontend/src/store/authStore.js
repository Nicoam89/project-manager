import { create } from "zustand";

import { getCurrentUser } from "../api/auth";

const getStoredToken = () =>
  localStorage.getItem("token") || null;

const normalizeUser = (user) => ({
  id: user._id || user.id,
  name: user.name,
  email: user.email,
  age: user.age || "",
  sex: user.sex || "",
  profession: user.profession || "",
  isEmailVerified: Boolean(user.isEmailVerified),
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
      user: normalizeUser(user),
      token,
      initialized: true,
    });
  },
  
  setUser: (user) => {
    set({
      user: normalizeUser(user),
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
      const currentUser = await getCurrentUser();

      const user = normalizeUser(
        currentUser
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
