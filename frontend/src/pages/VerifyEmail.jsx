import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { register as registerUser, verifyEmail } from "../api/auth";
import FormField from "../components/forms/FormField";
import useAuthStore from "../store/authStore";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const [manualToken, setManualToken] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [status, setStatus] = useState(token ? "loading" : "idle");
  const [message, setMessage] = useState(
    token
      ? "Verificando tu email..."
      : "Completa tus datos para recibir el mail de verificación."
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const confirmEmail = useCallback(async (verificationToken) => {
    setStatus("loading");
    setMessage("Verificando tu email...");

    try {
      const { user, token: authToken } = await verifyEmail(verificationToken);

      loginStore(user, authToken);
      setStatus("success");
      setMessage("Email verificado correctamente. Redirigiendo...");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1200);
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "No se pudo verificar el email. Solicita un nuevo enlace."
      );
    }
  }, [loginStore, navigate]);

  useEffect(() => {
    if (token) {
      confirmEmail(token);
    }
  }, [confirmEmail, token]);

  const handleRegister = async (data) => {
    setStatus("loading");
    setMessage("Enviando mail de verificación...");

    try {
      const response = await registerUser(data);

      setRegistrationEmail(data.email);
      setStatus("pending-verification");
      setMessage(
        response.verificationUrl
          ? `Te enviamos el mail de verificación a ${data.email}. Abrí el enlace recibido para continuar.`
          : `Registro exitoso. Te enviamos el mail de verificación a ${data.email}.`
      );

      if (response.verificationToken) {
        setManualToken(response.verificationToken);
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "No se pudo completar el registro. Intenta de nuevo."
      );
    }
  };

  const handleTokenSubmit = (event) => {
    event.preventDefault();

    const trimmedToken = manualToken.trim();

    if (!trimmedToken) {
      setStatus("error");
      setMessage("Ingresa el token de verificación para continuar.");
      return;
    }

    confirmEmail(trimmedToken);
  };

  const canEnterToken = status === "pending-verification" || status === "error";

  return (
    <main className="login-page">
      <section className="pm-card mb-8 space-y-4 p-5 login">
        <h1 className="pm-page-title">Registro y verificación de email</h1>
        <p role={status === "error" ? "alert" : "status"}>{message}</p>

        {!token && !registrationEmail ? (
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <FormField
              id="register-name"
              label="Nombre"
              required
              error={errors.name?.message}
            >
              {(fieldProps) => (
                <input
                  {...fieldProps}
                  type="text"
                  placeholder="Tu nombre"
                  autoComplete="name"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                  className="pm-input"
                />
              )}
            </FormField>

            <FormField
              id="register-email"
              label="Email"
              required
              error={errors.email?.message}
            >
              {(fieldProps) => (
                <input
                  {...fieldProps}
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  {...register("email", {
                    required: "El email es obligatorio",
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
              id="register-password"
              label="Contraseña"
              required
              error={errors.password?.message}
            >
              {(fieldProps) => (
                <input
                  {...fieldProps}
                  type="password"
                  placeholder="Contraseña"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                  className="pm-input"
                />
              )}
            </FormField>

            <button
              type="submit"
              className="pm-button"
              disabled={isSubmitting || status === "loading"}
            >
              {isSubmitting || status === "loading"
                ? "Enviando..."
                : "Enviar mail de verificación"}
            </button>
          </form>
        ) : null}

        {!token && registrationEmail ? (
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <p className="text-sm text-slate-500">
              ¿No se abrió el enlace? Pega el token recibido para verificar {registrationEmail}.
            </p>
            <label htmlFor="verification-token">Token de verificación</label>
            <input
              id="verification-token"
              type="text"
              value={manualToken}
              onChange={(event) => setManualToken(event.target.value)}
              placeholder="Pega tu token de verificación"
              className="pm-input"
              autoComplete="one-time-code"
              disabled={!canEnterToken || status === "loading"}
            />
            <button
              type="submit"
              className="pm-button"
              disabled={status === "loading" || !canEnterToken}
            >
              {status === "loading" ? "Verificando..." : "Verificar email"}
            </button>
          </form>
        ) : null}

        {status === "error" ? <Link to="/login">Volver a login</Link> : null}
      </section>
    </main>
  );
};

export default VerifyEmail;
