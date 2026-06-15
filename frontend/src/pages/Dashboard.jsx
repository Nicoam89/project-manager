import { useEffect, useMemo, useState } from "react";

import { getDashboardSummary } from "../api/dashboard";

import MainLayout from "../layouts/MainLayout";

const formatNumber = (value) =>
  new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 2,
  }).format(value || 0);

const ProgressBar = ({ value }) => (
  <div className="mt-3 h-2 rounded-full bg-slate-200">
    <div
      className="h-2 rounded-full bg-blue-600"
      style={{ width: `${Math.min(value || 0, 100)}%` }}
    />
  </div>
);

const MetricCard = ({ title, value, detail, tone = "blue" }) => {
  const toneClasses = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-green-100 bg-green-50 text-green-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    red: "border-red-100 bg-red-50 text-red-700",
    slate: "border-slate-100 bg-white text-slate-700",
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
      >
        {title}
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-900">
        {value}
      </p>

      {detail && (
        <p className="mt-2 text-sm text-slate-500">
          {detail}
        </p>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
         const summaryData = await getDashboardSummary();

        setSummary(summaryData);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "No se pudo cargar el dashboard"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, []);

  const statusRows = useMemo(
    () =>
      Object.entries(
        summary?.activityStatusCounts || {}
      ).sort(([, first], [, second]) => second - first),
    [summary]
  );

  if (isLoading) {
    return (
      <MainLayout>
        <p className="text-slate-500">
          Cargando métricas reales...
        </p>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="pm-page-title">Dashboard</h1>
        <p className="mt-2 text-slate-500">
          Métricas calculadas desde objetivos, metas,
          actividades, fechas límite y horas registradas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Avance actividades"
          value={`${summary?.activityCompletionRate || 0}%`}
          detail={`${summary?.completedActivities || 0} de ${summary?.activities || 0} actividades completadas`}
          tone="green"
        />

        <MetricCard
          title="Avance metas"
          value={`${summary?.averageGoalProgress || 0}%`}
          detail={`${summary?.completedGoals || 0} metas completadas de ${summary?.goals || 0}`}
          tone="blue"
        />

        <MetricCard
          title="Vencidas"
          value={summary?.overdueActivities || 0}
          detail="Actividades activas fuera de plazo"
          tone="red"
        />

        <MetricCard
          title="Próximos 7 días"
          value={summary?.dueSoonActivities || 0}
          detail="Actividades activas por vencer"
          tone="amber"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Progreso general
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Objetivos
                </span>
                <span className="text-slate-500">
                  {summary?.averageObjectiveProgress || 0}%
                </span>
              </div>
              <ProgressBar
                value={summary?.averageObjectiveProgress}
              />
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Metas
                </span>
                <span className="text-slate-500">
                  {summary?.averageGoalProgress || 0}%
                </span>
              </div>
              <ProgressBar
                value={summary?.averageGoalProgress}
              />
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Actividades
                </span>
                <span className="text-slate-500">
                  {summary?.activityCompletionRate || 0}%
                </span>
              </div>
              <ProgressBar
                value={summary?.activityCompletionRate}
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Horas
          </h2>

          <dl className="mt-5 space-y-4">
            <div className="flex justify-between">
              <dt className="text-slate-500">Registradas</dt>
              <dd className="font-semibold text-slate-900">
                {formatNumber(summary?.totalLoggedHours)} h
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Estimadas</dt>
              <dd className="font-semibold text-slate-900">
                {formatNumber(summary?.totalEstimatedHours)} h
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Restantes</dt>
              <dd className="font-semibold text-slate-900">
                {formatNumber(summary?.remainingEstimatedHours)} h
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Actividades por estado
        </h2>

        {statusRows.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {statusRows.map(([status, count]) => (
              <div
                key={status}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-sm font-medium text-slate-500">
                  {status.replaceAll("_", " ")}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {count}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-slate-500">
            Aún no hay actividades para calcular estados.
          </p>
        )}
      </section>
    </MainLayout>
  );
};

export default Dashboard;
