import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api/axios";

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
      const response =
        await api.post(
          "/auth/login",
          data
        );

      loginStore(
        {
          id: response.data._id,
          name: response.data.name,
          email:
            response.data.email,
        },
        response.data.token
      );

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "No se pudo iniciar sesión. Intenta de nuevo."
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
