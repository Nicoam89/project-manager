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

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MINIMUM_BAR_DAYS = 1;

const getId = (entity) =>
  typeof entity === "string"
    ? entity
    : entity?._id;

const toDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
};

const diffInDays = (start, end) =>
  Math.max(
    Math.round((end.getTime() - start.getTime()) / DAY_IN_MS),
    0
  );

const formatDate = (date) => {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
  }).format(date);
};

const getStatusLabel = (status) =>
  status || "Sin estado";

const clampProgress = (value) =>
  Math.min(Math.max(Number(value) || 0, 0), 100);

const completedStatuses = new Set([
  "COMPLETED",
  "ACCEPTED",
  "CLOSED",
  "WON",
]);

const getActivityProgress = (activity) => {
  if (activity.subtasks?.length) {
    const completed = activity.subtasks.filter(
      (subtask) => subtask.completed
    ).length;

    return Math.round(
      (completed / activity.subtasks.length) * 100
    );
  }

  return completedStatuses.has(activity.status)
    ? 100
    : 0;
};

const buildTimelineItems = ({
  objectives,
  goals,
  activities,
}) => {
  const objectiveItems = objectives.map((objective) => ({
    id: objective._id,
    type: "objective",
    label: "Objetivo",
    title: objective.title,
    status: objective.status,
    progress: objective.progress,
    startDate: toDate(objective.startDate),
    endDate: toDate(objective.endDate),
    href: `/objectives/${objective._id}`,
    parentId: null,
  }));

  const goalItems = goals.map((goal) => ({
    id: goal._id,
    type: "goal",
    label: "Meta",
    title: goal.title,
    status: goal.status,
    progress: goal.progress,
    startDate: toDate(goal.startDate),
    endDate: toDate(goal.endDate),
    href: `/goals/${goal._id}`,
    parentId: getId(goal.objective),
  }));

  const activityItems = activities.map((activity) => ({
    id: activity._id,
    type: "activity",
    label: "Actividad",
    title: activity.title,
    status: activity.status,
    progress: getActivityProgress(activity),
    startDate: toDate(activity.startDate),
    endDate: toDate(activity.dueDate),
    href: `/activities/${activity._id}`,
    parentId: getId(activity.goal),
  }));

  return [
    ...objectiveItems,
    ...goalItems,
    ...activityItems,
  ].map((item) => {
    const fallbackStart = item.startDate || item.endDate;
    const fallbackEnd = item.endDate || item.startDate;

    return {
      ...item,
      startDate: fallbackStart,
      endDate: fallbackEnd,
      hasCompleteDates: Boolean(item.startDate && item.endDate),
    };
  });
};

const getTimelineRange = (items) => {
  const datedItems = items.filter(
    (item) => item.startDate && item.endDate
  );

  if (!datedItems.length) {
    const today = toDate(new Date());

    return {
      start: today,
      end: addDays(today, 14),
      totalDays: 14,
    };
  }

  const start = new Date(
    Math.min(
      ...datedItems.map((item) => item.startDate.getTime())
    )
  );
  const end = new Date(
    Math.max(...datedItems.map((item) => item.endDate.getTime()))
  );
  const paddedStart = addDays(start, -1);
  const paddedEnd = addDays(end, 1);
  const totalDays = Math.max(
    diffInDays(paddedStart, paddedEnd),
    MINIMUM_BAR_DAYS
  );

  return {
    start: paddedStart,
    end: paddedEnd,
    totalDays,
  };
};

const getBarStyle = (item, range) => {
  if (!item.startDate || !item.endDate) {
    return {
      left: "0%",
      width: "100%",
    };
  }

  const offset = diffInDays(range.start, item.startDate);
  const duration = Math.max(
    diffInDays(item.startDate, item.endDate),
    MINIMUM_BAR_DAYS
  );

  return {
    left: `${(offset / range.totalDays) * 100}%`,
    width: `${(duration / range.totalDays) * 100}%`,
  };
};

const typeStyles = {
  objective: "bg-blue-600",
  goal: "bg-emerald-500",
  activity: "bg-amber-500",
};

const typeBadgeStyles = {
  objective: "bg-blue-50 text-blue-700",
  goal: "bg-emerald-50 text-emerald-700",
  activity: "bg-amber-50 text-amber-700",
};

const TimelineRow = ({ item, range }) => {
  const progress = clampProgress(item.progress);

  return (
    <div className="grid min-w-[860px] grid-cols-[18rem_1fr] border-t border-slate-100">
      <div className="bg-white px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadgeStyles[item.type]}`}>
            {item.label}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {getStatusLabel(item.status)}
          </span>
        </div>

        <Link
          to={item.href}
          className="mt-2 block font-semibold text-slate-950 hover:text-blue-700"
        >
          {item.title || "Sin título"}
        </Link>

        <p className="mt-1 text-xs text-slate-500">
          {formatDate(item.startDate)} — {formatDate(item.endDate)}
        </p>
      </div>

      <div className="relative bg-slate-50 px-4 py-5">
        <div className="absolute inset-y-0 left-4 right-4 rounded-xl bg-white" />
        <div
          className="relative h-8 rounded-full bg-slate-200"
          aria-label={`${item.label} ${item.title || "sin título"}: ${progress}% de avance`}
        >
          <div
            className={`absolute top-0 h-8 rounded-full ${typeStyles[item.type]} shadow-sm`}
            style={getBarStyle(item, range)}
          >
            <div
              className="h-full rounded-full bg-white/30"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};

export const GanttBoardView = ({
  isLoading,
  error,
  items,
}) => {
  const range = useMemo(
    () => getTimelineRange(items),
    [items]
  );

  if (isLoading) {
    return (
      <MainLayout>
        <p className="text-slate-500">
          Cargando tablero de Gantt...
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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Planificación visual
          </p>
          <h1 className="pm-page-title mt-1">
            Tablero de Gantt
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Visualiza objetivos, metas y actividades en una línea de tiempo compartida para detectar dependencias, ventanas de ejecución y fechas sin completar.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <strong className="text-slate-950">Rango:</strong> {formatDate(range.start)} — {formatDate(range.end)}
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-blue-800">
          <p className="text-2xl font-black">
            {items.filter((item) => item.type === "objective").length}
          </p>
          <p className="text-sm font-semibold">Objetivos</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
          <p className="text-2xl font-black">
            {items.filter((item) => item.type === "goal").length}
          </p>
          <p className="text-sm font-semibold">Metas</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-800">
          <p className="text-2xl font-black">
            {items.filter((item) => item.type === "activity").length}
          </p>
          <p className="text-sm font-semibold">Actividades</p>
        </div>
      </div>

      {items.length ? (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid min-w-[860px] grid-cols-[18rem_1fr] bg-slate-900 text-white">
            <div className="px-4 py-3 text-sm font-bold">
              Elemento
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-sm font-bold">
              <span>{formatDate(range.start)}</span>
              <span>Línea de tiempo</span>
              <span>{formatDate(range.end)}</span>
            </div>
          </div>

          {items.map((item) => (
            <TimelineRow
              key={`${item.type}-${item.id}`}
              item={item}
              range={range}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
          Aún no hay objetivos, metas ni actividades para mostrar en el tablero de Gantt.
        </div>
      )}

      {items.some((item) => !item.hasCompleteDates) && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Algunos elementos no tienen fecha de inicio o fin. El tablero usa la fecha disponible como referencia, pero conviene completar ambas fechas para una planificación precisa.
        </p>
      )}
    </MainLayout>
  );
};

const GanttBoard = () => {
  const [objectives, setObjectives] = useState([]);
  const [goals, setGoals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGantt = async () => {
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
            "No se pudo cargar el tablero de Gantt"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadGantt();
  }, []);

  const items = useMemo(
    () => buildTimelineItems({
      objectives,
      goals,
      activities,
    }),
    [activities, goals, objectives]
  );

  return (
    <GanttBoardView
      isLoading={isLoading}
      error={error}
      items={items}
    />
  );
};

export default GanttBoard;
