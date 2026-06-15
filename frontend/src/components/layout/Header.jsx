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
     <header className="sticky top-[6.75rem] z-20 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-6 sm:py-4 lg:top-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-slate-500">
            Bienvenido
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