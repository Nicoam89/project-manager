import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";

import TimeEntryForm from "../components/activities/TimeEntryForm";

const formatHours = (hours) =>
  new Intl.NumberFormat("es", {
    maximumFractionDigits: 1,
  }).format(Number(hours || 0));

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
  helper,
}) => (
  <div className="pm-card p-4">
    <p className="text-sm font-medium text-slate-500">
      {label}
    </p>

    <p className="mt-2 text-3xl font-bold text-slate-950">
      {value}
    </p>

    {helper ? (
      <p className="mt-1 text-xs text-slate-500">
        {helper}
      </p>
    ) : null}
  </div>
);

const DetailBadge = ({
  label,
  value,
}) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-slate-900">
      {value}
    </p>
  </div>
);

const SectionCard = ({
  title,
  description,
  children,
}) => (
  <section className="pm-card p-5">
    <div className="mb-4">
      <h2 className="text-lg font-bold text-slate-950">
        {title}
      </h2>

      {description ? (
        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      ) : null}
    </div>

    {children}
  </section>
);

const EmptyState = ({ children }) => (
  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
    {children}
  </div>
);

const TimeEntryItem = ({ entry }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-slate-900">
          {entry.description ||
            "Tiempo registrado"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {formatDate(entry.date)}
        </p>
      </div>

      <span className="pm-badge">
        {formatHours(entry.hours)} h
      </span>
    </div>
  </article>
);

const ActivityDetail = () => {
  const { id } = useParams();

  const [data, setData] =
    useState(null);

  const [error, setError] =
    useState("");

  const loadActivity = useCallback(
    async () => {
      try {
        setError("");

        const response =
          await api.get(
            `/activities/${id}/details`
          );

        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Error cargando actividad"
        );
      }
    },
    [id]
  );

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const addTime = async (
    payload
  ) => {
    await api.post(
      `/activities/${id}/time`,
      payload
    );

    await loadActivity();
  };

  if (!data) {
    return (
      <MainLayout>
        <div className="pm-card p-6">
          <p className="text-sm font-medium text-slate-500">
            {error || "Cargando actividad..."}
          </p>
        </div>
      </MainLayout>
    );
  }

  const {
    activity,
    stats,
  } = data;

  const timeEntries =
    activity.timeEntries || [];
  const comments = activity.comments || [];
  const subtasks = activity.subtasks || [];
  const dependencies =
    activity.dependencies || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <Link
          to="/activities"
          className="inline-flex text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          ← Volver a actividades
        </Link>

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        ) : null}

        <section className="pm-card overflow-hidden">
          <div className="border-b border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Detalle de actividad
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {activity.title}
                </h1>

                <p className="mt-3 text-slate-600">
                  {activity.description ||
                    "Sin descripción registrada."}
                </p>

                {activity.goal ? (
                  <div className="mt-4 text-sm text-slate-600">
                    Meta asociada:{" "}
                    <Link
                      to={`/goals/${activity.goal._id}`}
                      className="font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {activity.goal.title}
                    </Link>
                  </div>
                ) : null}
              </div>

              <div className="grid min-w-72 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <DetailBadge
                  label="Estado"
                  value={activity.status}
                />

                <DetailBadge
                  label="Flujo"
                  value={activity.workflowType}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 bg-slate-50 p-6 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Horas registradas"
              value={`${formatHours(
                stats.trackedHours
              )} h`}
              helper="Tiempo acumulado"
            />

            <StatCard
              label="Comentarios"
              value={stats.comments}
              helper="Notas de seguimiento"
            />

            <StatCard
              label="Subtareas"
              value={`${stats.completedSubtasks}/${stats.subtasks}`}
              helper="Completadas / totales"
            />

            <StatCard
              label="Dependencias"
              value={dependencies.length}
              helper="Actividades relacionadas"
            />
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <SectionCard
              title="Tiempo registrado"
              description="Historial de horas cargadas para esta actividad."
            >
              {timeEntries.length > 0 ? (
                <div className="space-y-3">
                  {timeEntries.map((entry) => (
                    <TimeEntryItem
                      key={entry._id}
                      entry={entry}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState>
                  Todavía no hay tiempo registrado.
                </EmptyState>
              )}
            </SectionCard>

            <SectionCard
              title="Subtareas"
              description="Checklist de trabajo asociado a la actividad."
            >
              {subtasks.length > 0 ? (
                <div className="space-y-3">
                  {subtasks.map((subtask) => (
                    <div
                      key={subtask._id}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <span
                        className={[
                          "h-3 w-3 rounded-full",
                          subtask.completed
                            ? "bg-emerald-500"
                            : "bg-slate-300",
                        ].join(" ")}
                      />

                      <p className="font-medium text-slate-900">
                        {subtask.title ||
                          "Subtarea sin título"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState>
                  Todavía no hay subtareas.
                </EmptyState>
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="Registrar tiempo"
              description="Agrega una nueva entrada al historial de trabajo."
            >
              <TimeEntryForm
                onSubmit={addTime}
              />
            </SectionCard>

            <SectionCard
              title="Comentarios"
              description="Notas registradas para seguimiento."
            >
              {comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <article
                      key={comment._id}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <p className="text-sm text-slate-700">
                        {comment.text}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        {formatDate(
                          comment.createdAt
                        )}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState>
                  Todavía no hay comentarios.
                </EmptyState>
              )}
            </SectionCard>

            <SectionCard
              title="Dependencias"
              description="Actividades requeridas o relacionadas."
            >
              {dependencies.length > 0 ? (
                <div className="space-y-3">
                  {dependencies.map((dependency) => (
                    <div
                      key={dependency._id}
                      className="rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <p className="font-medium text-slate-900">
                        {dependency.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {dependency.status}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState>
                  Sin dependencias registradas.
                </EmptyState>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ActivityDetail;