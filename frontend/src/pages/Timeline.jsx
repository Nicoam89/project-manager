import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { getActivities } from "../api/activities";
import { getGoals } from "../api/goals";
import { getObjectives } from "../api/objectives";

import MainLayout from "../layouts/MainLayout";

const getId = (entity) =>
  typeof entity === "string"
    ? entity
    : entity?._id;

const toDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (date) => {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
  }).format(date);
};

const formatMonth = (date) => {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es", {
    month: "long",
    year: "numeric",
  }).format(date);
};

const typeLabels = {
  objective: "Objetivo",
  goal: "Meta",
  activity: "Actividad",
};

const typeStyles = {
  objective: "border-blue-200 bg-blue-50 text-blue-700",
  goal: "border-emerald-200 bg-emerald-50 text-emerald-700",
  activity: "border-amber-200 bg-amber-50 text-amber-700",
};

const dotStyles = {
  objective: "bg-blue-600 ring-blue-100",
  goal: "bg-emerald-500 ring-emerald-100",
  activity: "bg-amber-500 ring-amber-100",
};

const buildTimelineEvents = ({
  objectives,
  goals,
  activities,
}) => {
  const objectiveEvents = objectives.map((objective) => ({
    id: objective._id,
    type: "objective",
    title: objective.title,
    description: objective.description,
    status: objective.status,
    startDate: toDate(objective.startDate),
    dueDate: toDate(objective.endDate),
    href: `/objectives/${objective._id}`,
    parent: null,
  }));

  const goalsById = new Map(
    goals.map((goal) => [goal._id, goal])
  );
  const objectivesById = new Map(
    objectives.map((objective) => [objective._id, objective])
  );

  const goalEvents = goals.map((goal) => ({
    id: goal._id,
    type: "goal",
    title: goal.title,
    description: goal.description,
    status: goal.status,
    startDate: toDate(goal.startDate),
    dueDate: toDate(goal.endDate),
    href: `/goals/${goal._id}`,
    parent: objectivesById.get(getId(goal.objective))?.title,
  }));

  const activityEvents = activities.map((activity) => ({
    id: activity._id,
    type: "activity",
    title: activity.title,
    description: activity.description,
    status: activity.status,
    startDate: toDate(activity.startDate),
    dueDate: toDate(activity.dueDate),
    href: `/activities/${activity._id}`,
    parent: goalsById.get(getId(activity.goal))?.title,
  }));

  return [
    ...objectiveEvents,
    ...goalEvents,
    ...activityEvents,
  ].sort((first, second) => {
    const firstDate = first.startDate || first.dueDate;
    const secondDate = second.startDate || second.dueDate;

    if (!firstDate && !secondDate) {
      return first.title.localeCompare(second.title, "es");
    }

    if (!firstDate) {
      return 1;
    }

    if (!secondDate) {
      return -1;
    }

    return firstDate.getTime() - secondDate.getTime();
  });
};

const groupEventsByMonth = (events) =>
  events.reduce((groups, event) => {
    const date = event.startDate || event.dueDate;
    const key = date
      ? `${date.getFullYear()}-${date.getMonth()}`
      : "undated";

    if (!groups[key]) {
      groups[key] = {
        label: formatMonth(date),
        events: [],
      };
    }

    groups[key].events.push(event);

    return groups;
  }, {});

const TimelineEvent = ({ event }) => (
  <article className="relative pl-10">
    <span
      className={`absolute left-0 top-5 h-4 w-4 rounded-full ring-8 ${dotStyles[event.type]}`}
      aria-hidden="true"
    />

    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${typeStyles[event.type]}`}>
              {typeLabels[event.type]}
            </span>

            {event.status && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {event.status}
              </span>
            )}
          </div>

          <Link
            to={event.href}
            className="mt-3 block text-lg font-bold text-slate-950 hover:text-blue-700"
          >
            {event.title || "Sin título"}
          </Link>

          {event.description && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">
              {event.description}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:text-right">
          <p>
            <span className="font-semibold text-slate-900">Inicio:</span> {formatDate(event.startDate)}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Fin:</span> {formatDate(event.dueDate)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500">
          {event.parent ? (
            <>
              <span className="font-semibold text-slate-700">Relacionado con:</span> {event.parent}
            </>
          ) : (
            "Elemento principal de la planificación"
          )}
        </p>

        <Link
          to={event.href}
          className="font-semibold text-blue-700 hover:text-blue-800"
        >
          Ver detalle
        </Link>
      </div>
    </div>
  </article>
);

export const TimelineView = ({
  isLoading,
  error,
  events,
}) => {
  const groupedEvents = useMemo(
    () => groupEventsByMonth(events),
    [events]
  );
  const totalWithDates = events.filter(
    (event) => event.startDate || event.dueDate
  ).length;

  if (isLoading) {
    return (
      <MainLayout>
        <p className="text-slate-500">
          Cargando línea de tiempo...
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Planificación cronológica
          </p>
          <h1 className="pm-page-title mt-1">
            Línea de tiempo
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Revisa objetivos, metas y actividades en orden cronológico para entender qué empieza, qué termina y cómo se conectan los próximos hitos.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <strong className="text-slate-950">{totalWithDates}</strong> de {events.length} elementos tienen fecha.
        </div>
      </div>

      {events.length ? (
        <div className="relative space-y-8 before:absolute before:bottom-0 before:left-2 before:top-0 before:w-px before:bg-slate-200">
          {Object.entries(groupedEvents).map(([key, group]) => (
            <section key={key} className="relative">
              <h2 className="mb-4 ml-10 text-sm font-bold uppercase tracking-wide text-slate-500">
                {group.label}
              </h2>

              <div className="space-y-4">
                {group.events.map((event) => (
                  <TimelineEvent
                    key={`${event.type}-${event.id}`}
                    event={event}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          Aún no hay objetivos, metas ni actividades para mostrar en la línea de tiempo.
        </div>
      )}
    </MainLayout>
  );
};

const Timeline = () => {
  const [objectives, setObjectives] = useState([]);
  const [goals, setGoals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const [objectivesData, goalsData, activitiesData] =
          await Promise.all([
            getObjectives(),
            getGoals(),
            getActivities(),
          ]);

        setObjectives(objectivesData);
        setGoals(goalsData);
        setActivities(activitiesData);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "No se pudo cargar la línea de tiempo"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTimeline();
  }, []);

  const events = useMemo(
    () => buildTimelineEvents({
      objectives,
      goals,
      activities,
    }),
    [activities, goals, objectives]
  );

  return (
    <TimelineView
      isLoading={isLoading}
      error={error}
      events={events}
    />
  );
};

export default Timeline;
