import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { verifyEmail } from "../api/auth";
import useAuthStore from "../store/authStore";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const [manualToken, setManualToken] = useState("");
  const [status, setStatus] = useState(token ? "loading" : "idle");
  const [message, setMessage] = useState(
    token
      ? "Verificando tu email..."
      : "Pega el token o abre el enlace que recibiste para verificar tu email."
  );

  const confirmEmail = async (verificationToken) => {
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
  };

  useEffect(() => {
    if (token) {
      confirmEmail(token);
    }
  }, [token]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedToken = manualToken.trim();

    if (!trimmedToken) {
      setStatus("error");
      setMessage("Ingresa el token de verificación para continuar.");
      return;
    }

    confirmEmail(trimmedToken);
  };

  return (
    <main className="login-page">
      <section className="pm-card mb-8 space-y-4 p-5 login">
        <h1 className="pm-page-title">Verificación de email</h1>
        <p role={status === "error" ? "alert" : "status"}>{message}</p>

        {!token ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="verification-token">Token de verificación</label>
            <input
              id="verification-token"
              type="text"
              value={manualToken}
              onChange={(event) => setManualToken(event.target.value)}
              placeholder="Pega tu token de verificación"
              className="pm-input"
              autoComplete="one-time-code"
            />
            <button
              type="submit"
              className="pm-button"
              disabled={status === "loading"}
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
