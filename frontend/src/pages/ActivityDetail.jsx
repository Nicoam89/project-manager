import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  addActivityTime,
  getActivities,
  getActivityDetails,
  updateActivity,
} from "../api/activities";

import MainLayout from "../layouts/MainLayout";

import TimeEntryForm from "../components/activities/TimeEntryForm";

const EMPTY_ACTIVITY_MESSAGE = "Sin descripción registrada.";

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

const getActivityCollections = (activity) => ({
  comments: activity.comments || [],
  dependencies: activity.dependencies || [],
  subtasks: activity.subtasks || [],
  timeEntries: activity.timeEntries || [],
});

const PageShell = ({ children }) => (
  <MainLayout>
    <div className="mx-auto max-w-7xl space-y-6">
      {children}
    </div>
  </MainLayout>
);

const LoadingState = ({ error }) => (
  <PageShell>
    <div className="pm-card p-6">
      <p className="text-sm font-medium text-slate-500">
        {error || "Cargando actividad..."}
      </p>
    </div>
  </PageShell>
);

const ErrorBanner = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
    >
      {message}
    </div>
  );
};

const StatCard = ({
  label,
  value,
  helper,
}) => (
  <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm shadow-slate-200/70">
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
  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-slate-900">
      {value || "Sin definir"}
    </p>
  </div>
);

const SectionCard = ({
  title,
  description,
  action,
  children,
}) => (
  <section className="pm-card p-5">
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-950">
          {title}
        </h2>

        {description ? (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="shrink-0">
          {action}
        </div>
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

const DetailHeader = ({ activity }) => (
  <section className="pm-card overflow-hidden">
    <div className="bg-gradient-to-br from-blue-50 via-white to-slate-50 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Detalle de actividad
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            {activity.title}
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-600">
            {activity.description || EMPTY_ACTIVITY_MESSAGE}
          </p>

          {activity.goal ? (
            <div className="mt-5 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-slate-600">
              Meta asociada:{" "}
              <Link
                to={`/goals/${activity.goal._id}`}
                className="ml-1 font-semibold text-blue-600 hover:text-blue-800"
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
          <DetailBadge
            label="Fecha de inicio"
            value={formatDate(activity.startDate)}
          />

          <DetailBadge
            label="Fecha de fin"
            value={formatDate(activity.dueDate)}
          />

        </div>
      </div>
    </div>
  </section>
);

const StatsGrid = ({
  dependenciesCount,
  stats,
}) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <StatCard
      label="Horas registradas"
      value={`${formatHours(stats.trackedHours)} h`}
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
      value={dependenciesCount}
      helper="Actividades relacionadas"
    />
  </div>
);

const TimeEntryItem = ({ entry }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-slate-900">
          {entry.description || "Tiempo registrado"}
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

const SubtaskItem = ({ subtask }) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
    <span
      className={[
        "h-3 w-3 rounded-full",
        subtask.completed
          ? "bg-emerald-500"
          : "bg-slate-300",
      ].join(" ")}
    />

    <p className="font-medium text-slate-900">
      {subtask.title || "Subtarea sin título"}
    </p>
  </div>
);

const CommentItem = ({ comment }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4">
    <p className="text-sm leading-6 text-slate-700">
      {comment.text}
    </p>

    <p className="mt-2 text-xs text-slate-500">
      {formatDate(comment.createdAt)}
    </p>
  </article>
);

const DependencyItem = ({ dependency }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-3">
    <p className="font-medium text-slate-900">
      {dependency.title}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      {dependency.status}
    </p>
  </div>
);

const CollectionSection = ({
  description,
  emptyMessage,
  items,
  renderItem,
  title,
}) => (
  <SectionCard
    title={title}
    description={description}
  >
    {items.length > 0 ? (
      <div className="space-y-3">
        {items.map(renderItem)}
      </div>
    ) : (
      <EmptyState>
        {emptyMessage}
      </EmptyState>
    )}
  </SectionCard>
);

const ActivityDetail = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [activities, setActivities] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [dependencyId, setDependencyId] = useState("");
  const [subtaskTitle, setSubtaskTitle] = useState("");


  const loadActivity = useCallback(async () => {
    try {
      setError("");

 const activityData = await getActivityDetails(id);

      setData(activityData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error cargando actividad"
      );
    }
  }, [id]);

   const loadActivities = useCallback(async () => {
    const activitiesData = await getActivities();

    setActivities(activitiesData);
  }, []);

  useEffect(() => {
    loadActivity();
    loadActivities();
  }, [loadActivity, loadActivities]);

  const updateActivityCollections = async (payload) => {
    await updateActivity(id, payload);

    await loadActivity();
  };

  const addTime = async (payload) => {
    await addActivityTime(id, payload);

    await loadActivity();
  };

  const addComment = async (event) => {
    event.preventDefault();

    const text = commentText.trim();

    if (!text) {
      return;
    }

    await updateActivityCollections({
      comments: [
        ...comments.map((comment) => ({
          _id: comment._id,
          author: comment.author,
          createdAt: comment.createdAt,
          text: comment.text,
        })),
        { text },
      ],
    });

    setCommentText("");
  };

  const addDependency = async (event) => {
    event.preventDefault();

    if (!dependencyId) {
      return;
    }

    await updateActivityCollections({
      dependencies: [
        ...dependencies.map((dependency) => dependency._id || dependency),
        dependencyId,
      ],
    });

    setDependencyId("");
  };

  const addSubtask = async (event) => {
    event.preventDefault();

    const title = subtaskTitle.trim();

    if (!title) {
      return;
    }

    await updateActivityCollections({
      subtasks: [
        ...subtasks.map((subtask) => ({
          _id: subtask._id,
          title: subtask.title,
          completed: Boolean(subtask.completed),
        })),
        {
          title,
          completed: false,
        },
      ],
    });

    setSubtaskTitle("");
  };

  const toggleSubtask = async (targetSubtask) => {
    await updateActivityCollections({
      subtasks: subtasks.map((subtask) => ({
        _id: subtask._id,
        title: subtask.title,
        completed:
          subtask._id === targetSubtask._id
            ? !subtask.completed
            : Boolean(subtask.completed),
      })),
    });
  };

  const collections = useMemo(
    () => getActivityCollections(data?.activity || {}),
    [data]
  );

  if (!data) {
    return <LoadingState error={error} />;
  }

  const { activity, stats } = data;
  const {
    comments,
    dependencies,
    subtasks,
    timeEntries,
  } = collections;

  const dependencyIds = dependencies.map(
    (dependency) => dependency._id || dependency
  );

  const availableDependencies = activities.filter(
    (candidate) =>
      candidate._id !== activity._id &&
      !dependencyIds.includes(candidate._id)
  );

  return (
    <PageShell>
      <Link
        to="/activities"
        className="inline-flex text-sm font-semibold text-blue-600 hover:text-blue-800"
      >
        ← Volver a actividades
      </Link>

      <ErrorBanner message={error} />

      <DetailHeader activity={activity} />

      <StatsGrid
        dependenciesCount={dependencies.length}
        stats={stats}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <CollectionSection
            title="Tiempo registrado"
            description="Historial de horas cargadas para esta actividad."
            emptyMessage="Todavía no hay tiempo registrado."
            items={timeEntries}
            renderItem={(entry) => (
              <TimeEntryItem
                key={entry._id}
                entry={entry}
              />
            )}
          />

          <SectionCard
            title="Subtareas"
            description="Checklist de trabajo asociado a la actividad."
            action={(
              <form
                onSubmit={addSubtask}
                className="flex gap-2"
              >
                <input
                  value={subtaskTitle}
                  onChange={(event) =>
                    setSubtaskTitle(event.target.value)
                  }
                  className="pm-input min-w-0"
                  placeholder="Nueva subtarea"
                />

                <button
                  type="submit"
                  className="pm-button whitespace-nowrap"
                >
                  Agregar
                </button>
              </form>
            )}
          >
            {subtasks.length > 0 ? (
              <div className="space-y-3">
                {subtasks.map((subtask) => (
                  <button
                    key={subtask._id}
                    type="button"
                    onClick={() => toggleSubtask(subtask)}
                    className="w-full text-left"
                  >
                    <SubtaskItem subtask={subtask} />
                  </button>
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
            <TimeEntryForm onSubmit={addTime} />
          </SectionCard>

          <SectionCard
            title="Comentarios"
            description="Notas registradas para seguimiento."
            action={(
              <form
                onSubmit={addComment}
                className="flex gap-2"
              >
                <input
                  value={commentText}
                  onChange={(event) =>
                    setCommentText(event.target.value)
                  }
                  className="pm-input min-w-0"
                  placeholder="Nuevo comentario"
                />

                <button
                  type="submit"
                  className="pm-button whitespace-nowrap"
                >
                  Agregar
                </button>
              </form>
            )}
          >
            {comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                  />
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
            action={(
              <form
                onSubmit={addDependency}
                className="flex gap-2"
              >
                <select
                  value={dependencyId}
                  onChange={(event) =>
                    setDependencyId(event.target.value)
                  }
                  className="pm-input min-w-0"
                >
                  <option value="">
                    Selecciona actividad
                  </option>

                  {availableDependencies.map((candidate) => (
                    <option
                      key={candidate._id}
                      value={candidate._id}
                    >
                      {candidate.title}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="pm-button whitespace-nowrap"
                >
                  Agregar
                </button>
              </form>
            )}
          >
            {dependencies.length > 0 ? (
              <div className="space-y-3">
                {dependencies.map((dependency) => (
                  <DependencyItem
                    key={dependency._id || dependency}
                    dependency={dependency}
                  />
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
    </PageShell>
  );
};

export default ActivityDetail;
