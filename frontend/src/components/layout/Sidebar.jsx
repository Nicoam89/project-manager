import {
  FaHome,
  FaBullseye,
  FaTasks,
  FaCog,
  FaTable,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: FaHome,
  },
  {
    to: "/objectives",
    label: "Objetivos",
    icon: FaBullseye,
  },
  {
    to: "/planning-grid",
    label: "Grilla",
    icon: FaTable,
  },
  {
    to: "/goals",
    label: "Metas",
    icon: FaTasks,
  },
  {
    to: "/activities",
    label: "Actividades",
    icon: FaTasks,
  },
  {
    to: "/settings",
    label: "Configuración",
    icon: FaCog,
  },
];

const MobileNav = () => (
<nav
  aria-label="Navegación principal móvil"
  className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur sm:py-3 lg:hidden"
>
    <div className="mb-2 flex items-center gap-3 px-1 sm:mb-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        <img src="/1.png" alt="Logo" className="h-9 w-9 rounded-xl object-contain" />
      </div>

      <div className="min-w-0">
        <h1 className="truncate text-base font-bold tracking-tight text-slate-950">
          A.M.O. iQ
        </h1>
      </div>
    </div>

    <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/dashboard"}
            className={({ isActive }) =>
              [
               "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition sm:text-sm",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              ].join(" ")
            }
          >
             <Icon className="text-base" aria-hidden="true" />

            <span>
              {link.label}
            </span>
          </NavLink>
        );
      })}
    </div>
  </nav>
);

const Sidebar = () => {
  return (
    <>
      <MobileNav />

      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/90 px-4 py-5 shadow-sm backdrop-blur lg:block">
        <div className="mb-8 px-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20">
            <img src="/1.png" alt="Logo"></img>
          </div>

          <div className="mt-4">
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              A.M.O. iQ
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Actividades, Metas & Objetivos Inteligentes
            </p>
          </div>
        </div>

         <nav
          aria-label="Navegación principal"
          className="space-y-1"
        >
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/dashboard"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  ].join(" ")
                }
              >
                 <Icon className="text-base" aria-hidden="true" />

                <span>
                  {link.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
