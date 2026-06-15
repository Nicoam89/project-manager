import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../api/auth";

import useAuthStore from "../store/authStore";

const Login = () => {
  const [errorMessage, setErrorMessage] =
    useState("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const loginStore =
    useAuthStore(
      (state) => state.login
    );

  const onSubmit = async (data) => {
    setErrorMessage("");

    try {
      const user = await login(data);

      loginStore(
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        user.token
      );

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      const isDatabaseUnavailable =
        error.response?.status === 503 &&
        error.response?.data?.code ===
          "DATABASE_UNAVAILABLE";

      const fallbackMessage =
        "No se pudo iniciar sesión. Intenta de nuevo.";
      const databaseUnavailableMessage =
        "No se puede iniciar sesión porque el backend no está conectado a MongoDB. " +
        "Revisa MONGODB_URI, credenciales y la IP permitida en MongoDB Atlas Network Access.";

      setErrorMessage(
        isDatabaseUnavailable
          ? databaseUnavailableMessage
          : error.response?.data?.message ||
              fallbackMessage
      );
    }
  };

  return (

    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="pm-card mb-8 space-y-4 p-5 login"
    >
      {errorMessage ? (
        <p role="alert">
          {errorMessage}
        </p>
      ) : null}

      <input
        type="email"
        placeholder="Email"
        autoComplete="email"
        {...register("email", {
          required:
            "El email es obligatorio",
        })}
        className="pm-input"
      />

      <input
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        {...register("password", {
          required:
            "La contraseña es obligatoria",
        })}
        className="pm-input"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="border px-4 py-2 rounded"
      >
        {isSubmitting
          ? "Ingresando..."
          : "Login"}

      </button>
    </form>
  );
};

export default Login;
