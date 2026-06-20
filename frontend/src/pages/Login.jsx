import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../api/auth";

import FormField from "../components/forms/FormField";

import useAuthStore from "../store/authStore";

const Login = () => {
  const [errorMessage, setErrorMessage] =
    useState("");

  const navigate = useNavigate();

   const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
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

      navigate("/dashboard", {
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

         <FormField
          id="login-email"
          label="Email"
          required
          error={errors.email?.message}
        >
          {(fieldProps) => (
            <input
              {...fieldProps}
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register("email", {
                required:
                  "El email es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email inválido",
                },
              })}
              className="pm-input"
            />
          )}
        </FormField>

        <FormField
          id="login-password"
          label="Contraseña"
          required
          error={errors.password?.message}
        >
          {(fieldProps) => (
            <input
              {...fieldProps}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register("password", {
                required:
                  "La contraseña es obligatoria",
              })}
              className="pm-input"
            />
          )}
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="pm-button"
        >
          {isSubmitting
            ? "Ingresando..."
            : "Login"}
        </button>
         <p className="login__help">
          ¿Nuevo por aqui?{ " " }
          <Link to="/verify-email">
            <Regirstarse></Regirstarse>
          </Link>
        </p>
      </form>    
    </main>
  );
};

export default Login;
