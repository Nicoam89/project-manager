import { useNavigate } from "react-router-dom";

import useAuthStore from "../../store/authStore";

const Header = () => {
  const navigate = useNavigate();

  const user =
    useAuthStore(
      (state) => state.user
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Bienvenido
          </p>

          <h2 className="text-xl font-bold text-slate-950">
            Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.name || "Usuario"}
            </p>

            <p className="text-xs text-slate-500">
              Sesión activa
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="pm-button pm-button-secondary"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;