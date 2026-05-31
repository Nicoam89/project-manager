import {
  FaHome,
  FaBullseye,
  FaTasks,
  FaColumns,
  FaCog,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 border-r">
      <div className="p-4 text-xl font-bold">
        Project Manager
      </div>

      <nav className="flex flex-col">
        <Link
          to="/"
          className="p-4 hover:bg-gray-100"
        >
          <FaHome className="inline mr-2" />
          Dashboard
        </Link>

        <Link
          to="/objectives"
          className="p-4 hover:bg-gray-100"
        >
          <FaBullseye className="inline mr-2" />
          Objetivos
        </Link>

        <Link
          to="/goals"
          className="p-4 hover:bg-gray-100"
        >
          <FaTasks className="inline mr-2" />
          Metas
        </Link>

        <Link
          to="/activities"
          className="p-4 hover:bg-gray-100"
        >
          <FaTasks className="inline mr-2" />
          Actividades
        </Link>

        <Link
          to="/kanban"
          className="p-4 hover:bg-gray-100"
        >
          <FaColumns className="inline mr-2" />
          Kanban
        </Link>

        <Link
          to="/settings"
          className="p-4 hover:bg-gray-100"
        >
          <FaCog className="inline mr-2" />
          Configuración
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;