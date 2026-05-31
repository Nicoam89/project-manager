import { useEffect, useState } from "react";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";

const Dashboard = () => {
  const [summary, setSummary] =
    useState(null);

  useEffect(() => {
    const loadSummary =
      async () => {
        const response =
          await api.get(
            "/dashboard/summary"
          );

        setSummary(response.data);
      };

    loadSummary();
  }, []);

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <h3>Objetivos</h3>

          <p className="text-3xl">
            {summary?.objectives || 0}
          </p>
        </div>

        <div className="border rounded p-4">
          <h3>Metas</h3>

          <p className="text-3xl">
            {summary?.goals || 0}
          </p>
        </div>

        <div className="border rounded p-4">
          <h3>Actividades</h3>

          <p className="text-3xl">
            {summary?.activities || 0}
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;