import { useEffect, useState } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import { getGoalDetails } from "../api/goals";

import MainLayout from "../layouts/MainLayout";

const formatDate = (date) => {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
  }).format(new Date(date));
};

const StatCard = ({
  label,
  value,
  tone = "blue",
}) => {
  const toneClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="pm-card p-5">
      <p className={`pm-badge ${toneClasses[tone]}`}>
        {label}
      </p>
      <p className="mt-4 text-3xl font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
};

const GoalDetail = () => {
  const { id } = useParams();

  const [data, setData] =
    useState(null);

  useEffect(() => {
    const loadGoal =
      async () => {
        const goalData =
          await getGoalDetails(id);

        setData(goalData);
      };

    loadGoal();
  }, [id]);

  if (!data) {
    return (
      <MainLayout>
        <p className="text-slate-500">
          Cargando detalle de la meta...
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Link
        to="/goals"
        className="text-sm font-semibold text-blue-700 hover:text-blue-800"
      >
        ← Volver a metas
      </Link>

      <section className="pm-card mt-4 p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="pm-badge">
              Detalle de meta
            </p>

            <h1 className="pm-page-title mt-4">
              {data.goal.title}
            </h1>

            <p className="mt-2 max-w-3xl text-slate-500">
              {data.goal.description || "Sin descripción"}
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 px-5 py-4 text-center md:min-w-36">
            <p className="text-sm font-semibold text-blue-700">
              Progreso
            </p>
            <p className="mt-1 text-3xl font-bold text-blue-900">
              {data.stats.progress}%
            </p>
          </div>
        </div>

        {data.goal.objective && (
          <p className="mt-5 text-sm text-slate-600">
            Objetivo:{" "}
            <Link
              to={`/objectives/${data.goal.objective._id}`}
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              {data.goal.objective.title}
            </Link>
          </p>
        )}

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{
              width: `${Math.min(
                data.stats.progress || 0,
                100
              )}%`,
            }}
          />
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="pm-card p-5">
          <p className="text-sm font-medium text-slate-500">
            Fecha de inicio
          </p>
          <p className="mt-2 font-semibold text-slate-950">
            {formatDate(data.goal.startDate)}
          </p>
        </div>

        <div className="pm-card p-5">
          <p className="text-sm font-medium text-slate-500">
            Fecha de fin
          </p>
          <p className="mt-2 font-semibold text-slate-950">
            {formatDate(data.goal.endDate)}
          </p>
        </div>

        <div className="pm-card p-5">
          <p className="text-sm font-medium text-slate-500">
            Comentarios
          </p>
          <p className="mt-2 font-semibold text-slate-950">
            {data.goal.comments || "Sin comentarios"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard
          label="Actividades"
          value={data.stats.activities}
        />

        <StatCard
          label="Completadas"
          value={data.stats.completedActivities}
          tone="green"
        />

        <StatCard
          label="Pendientes"
          value={data.stats.pendingActivities}
          tone="amber"
        />
      </div>

      <section className="mt-8 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            Actividades
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Actividades asociadas a esta meta con el mismo estilo de tarjetas.
          </p>
        </div>

        <div className="space-y-4">
          {data.activities.map(
            (activity) => (
              <div
                key={activity._id}
                className="pm-card pm-card-hover p-5"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <Link
                      to={`/activities/${activity._id}`}
                      className="text-xl font-semibold text-slate-950 hover:text-blue-700"
                    >
                      {activity.title}
                    </Link>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="pm-badge bg-slate-100 text-slate-700">
                        {activity.status}
                      </span>
                      <span className="pm-badge bg-blue-50 text-blue-700">
                        {activity.priority || "MEDIUM"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default GoalDetail;