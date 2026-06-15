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
      const { user, token } = await login(data);

      loginStore(
        user,
        token

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

    <main className="login-page">
      <form
        aria-labelledby="login-title"
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="pm-card mb-8 space-y-4 p-5 login"
      >
        <div className="login-brand">
          <img
            src="/1.png"
            alt="Logo de A.M.O. iQ"
            className="login-brand__logo"
          />

          <div>
            <h1
              id="login-title"
              className="pm-page-title"
            >
              A.M.O. iQ
            </h1>

            <p className="login-brand__subtitle">
              Actividades, Metas & Objetivos Inteligentes
            </p>
          </div>
        </div>

        <h2 className="login__heading">
          Iniciar sesión
        </h2>

        {errorMessage ? (
          <p role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className="w-full">
          <label
            className="mb-1 block text-sm font-semibold text-slate-700"
            htmlFor="login-email"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email", {
              required:
                "El email es obligatorio",
            })}
            className="pm-input"
          />
        </div>

        <div className="w-full">
          <label
            className="mb-1 block text-sm font-semibold text-slate-700"
            htmlFor="login-password"
          >
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            {...register("password", {
              required:
                "La contraseña es obligatoria",
            })}
            className="pm-input"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="pm-button"
        >
          {isSubmitting
            ? "Ingresando..."
            : "Login"}
        </button>
      </form>
    </main>
  );
};

export default Login;
