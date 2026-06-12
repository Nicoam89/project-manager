import { Navigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

const ProtectedRoute = ({
  children,
}) => {
  const token =
    useAuthStore(
      (state) => state.token
    );

  const initialized =
    useAuthStore(
      (state) => state.initialized
    );

  const loading =
    useAuthStore(
      (state) => state.loading
    );

  if (!initialized || loading) {
    return <p>Cargando sesión...</p>;
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
