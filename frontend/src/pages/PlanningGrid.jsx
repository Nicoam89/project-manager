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

const completedStatuses = new Set([
  "COMPLETED",
  "ACCEPTED",
  "CLOSED",
  "WON",
]);

const formatDate = (date) => {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
  }).format(new Date(date));
};

const clampProgress = (value) =>
  Math.min(
    Math.max(Number(value) || 0, 0),
    100
  );

const getId = (entity) =>
  typeof entity === "string"
    ? entity
    : entity?._id;

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

const ProgressBadge = ({ value }) => {
  const progress = clampProgress(value);

  return (
    <div className="min-w-32">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>{progress}%</span>
      </div>

      <div className="mt-1 h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-blue-600"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const EmptyRow = ({ children }) => (
  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
    {children}
  </div>
);

export const PlanningGridView = ({
  isLoading,
  error,
  groupedObjectives,
}) => {
  if (isLoading) {
    return (
      <MainLayout>
        <p className="text-slate-500">
          Cargando grilla de planificación...
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
        <h1 className="pm-page-title">
          Grilla de planificación
        </h1>
        <p className="mt-2 max-w-3xl text-slate-500">
          Vista agrupada de objetivos, metas,
          actividades y subactividades con su grado
          de avance y fecha de fin.
        </p>
      </div>

      {groupedObjectives.length ? (
        <div className="space-y-6">
          {groupedObjectives.map((objective) => (
            <section
              key={objective._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <header className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Objetivo
                    </p>
                    <Link
                      to={`/objectives/${objective._id}`}
                      className="text-xl font-bold text-slate-950 hover:text-blue-700"
                    >
                      {objective.title}
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span className="rounded-full bg-white px-3 py-1 font-medium shadow-sm">
                      {objective.status}
                    </span>
                    <ProgressBadge
                      value={objective.progress}
                    />
                  </div>
                </div>
              </header>

              <div className="divide-y divide-slate-100">
                {objective.goals.length ? (
                  objective.goals.map((goal) => (
                    <div
                      key={goal._id}
                      className="p-5"
                    >
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_8rem_9rem_8rem] lg:items-center">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                            Meta
                          </p>
                          <Link
                            to={`/goals/${goal._id}`}
                            className="font-semibold text-slate-900 hover:text-blue-700"
                          >
                            {goal.title}
                          </Link>
                        </div>
                        <span className="text-sm text-slate-600">
                          {goal.status}
                        </span>
                        <span className="text-sm text-slate-600">
                          {formatDate(goal.endDate)}
                        </span>
                        <ProgressBadge
                          value={goal.progress}
                        />
                      </div>

                      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                              <th className="px-4 py-3">Actividad</th>
                              <th className="px-4 py-3">Estado</th>
                              <th className="px-4 py-3">Fecha fin</th>
                              <th className="px-4 py-3">Avance</th>
                              <th className="px-4 py-3">Subactividades</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {goal.activities.length ? (
                              goal.activities.map((activity) => (
                                <tr key={activity._id}>
                                  <td className="px-4 py-3 align-top">
                                    <Link
                                      to={`/activities/${activity._id}`}
                                      className="font-medium text-slate-900 hover:text-blue-700"
                                    >
                                      {activity.title}
                                    </Link>
                                  </td>
                                  <td className="px-4 py-3 align-top text-slate-600">
                                    {activity.status}
                                  </td>
                                  <td className="px-4 py-3 align-top text-slate-600">
                                    {formatDate(activity.dueDate)}
                                  </td>
                                  <td className="px-4 py-3 align-top">
                                    <ProgressBadge
                                      value={getActivityProgress(activity)}
                                    />
                                  </td>
                                  <td className="px-4 py-3 align-top">
                                    {activity.subtasks?.length ? (
                                      <ul className="space-y-2">
                                        {activity.subtasks.map(
                                          (subtask) => (
                                            <li
                                              key={subtask._id || subtask.title}
                                              className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
                                            >
                                              <span className="text-slate-700">
                                                {subtask.title ||
                                                  "Subactividad sin título"}
                                              </span>
                                              <span className="shrink-0 text-xs font-semibold text-slate-500">
                                                {subtask.completed
                                                  ? "100%"
                                                  : "0%"}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    ) : (
                                      <span className="text-slate-400">
                                        Sin subactividades
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="5"
                                  className="px-4 py-4 text-slate-500"
                                >
                                  Esta meta aún no tiene actividades.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5">
                    <EmptyRow>
                      Este objetivo aún no tiene metas asociadas.
                    </EmptyRow>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyRow>
          Aún no hay objetivos para mostrar en la grilla de planificación.
        </EmptyRow>
      )}
    </MainLayout>
  );
};

const PlanningGrid = () => {
  const [objectives, setObjectives] =
    useState([]);
  const [goals, setGoals] = useState([]);
  const [activities, setActivities] =
    useState([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGrid = async () => {
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
            "No se pudo cargar la grilla de planificación"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadGrid();
  }, []);

  const groupedObjectives = useMemo(() => {
    const activitiesByGoal = activities.reduce(
      (collection, activity) => {
        const goalId = getId(activity.goal);

        if (!goalId) {
          return collection;
        }

        return {
          ...collection,
          [goalId]: [
            ...(collection[goalId] || []),
            activity,
          ],
        };
      },
      {}
    );

    const goalsByObjective = goals.reduce(
      (collection, goal) => {
        const objectiveId = getId(goal.objective);

        if (!objectiveId) {
          return collection;
        }

        return {
          ...collection,
          [objectiveId]: [
            ...(collection[objectiveId] || []),
            {
              ...goal,
              activities:
                activitiesByGoal[goal._id] || [],
            },
          ],
        };
      },
      {}
    );

    return objectives.map((objective) => ({
      ...objective,
      goals: goalsByObjective[objective._id] || [],
    }));
  }, [activities, goals, objectives]);

   return (
    <PlanningGridView
      isLoading={isLoading}
      error={error}
      groupedObjectives={groupedObjectives}
    />
  );
};

export default PlanningGrid;
