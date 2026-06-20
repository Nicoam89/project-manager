import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "/api",
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const isLoginRequest =
      requestUrl.includes("/auth/login");

       const isEmailVerificationError =
      status === 403 &&
      error.response?.data?.code === "EMAIL_NOT_VERIFIED";

    if (
      (status === 401 && !isLoginRequest) ||
      isEmailVerificationError
    ) {

      localStorage.removeItem("token");

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
