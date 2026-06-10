import {
  FaHome,
  FaBullseye,
  FaTasks,
  FaColumns,
  FaCog,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/",
    label: "Dashboard",
    icon: FaHome,
  },
  {
    to: "/objectives",
    label: "Objetivos",
    icon: FaBullseye,
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
    to: "/kanban",
    label: "Kanban",
    icon: FaColumns,
  },
  {
    to: "/settings",
    label: "Configuración",
    icon: FaCog,
  },
];

const Sidebar = () => {
  return (
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

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")
              }
            >
              <Icon className="text-base" />

              <span>
                {link.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;