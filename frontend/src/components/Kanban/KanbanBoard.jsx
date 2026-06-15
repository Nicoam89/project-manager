import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DndContext,
} from "@dnd-kit/core";

import {
  getActivities,
  updateActivityStatus,
} from "../../api/activities";

import { getGoals } from "../../api/goals";

import {
  WORKFLOWS,
  WORKFLOW_OPTIONS,
} from "../../constants/workflows";

import KanbanColumn from "./KanbanColumn";

const KanbanBoard = ({
  title = "Vista Kanban",
  description = "Organiza las actividades de tus metas por estado.",
  initialGoalId = "",
  showGoalFilter = true,
}) => {
  const [activities, setActivities] =
    useState([]);

  const [goals, setGoals] =
    useState([]);

  const [workflowType, setWorkflowType] =
    useState("STANDARD");

  const [goalId, setGoalId] =
    useState(initialGoalId);

  const [error, setError] =
    useState("");

  const statuses =
    WORKFLOWS[workflowType] ||
    WORKFLOWS.STANDARD;

  const loadBoardData = useCallback(
    async () => {
      try {
        setError("");

        const [activitiesData, goalsData] =
          await Promise.all([
            getActivities({ workflowType }),
            getGoals(),
          ]);

        setActivities(activitiesData);
        setGoals(goalsData);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Error cargando la vista Kanban"
        );
      }
    },
    [workflowType]
  );

  useEffect(() => {
    loadBoardData();
  }, [loadBoardData]);

  useEffect(() => {
    setGoalId(initialGoalId);
  }, [initialGoalId]);

  const filteredActivities = useMemo(
    () => {
      if (!goalId) {
        return activities;
      }

      return activities.filter(
        (activity) =>
          activity.goal?._id === goalId ||
          activity.goal === goalId
      );
    },
    [activities, goalId]
  );

  const selectedGoal = goals.find(
    (goal) => goal._id === goalId
  );

  const handleDragEnd = async (event) => {
    const activityId = event.active.id;
    const newStatus = event.over?.id;

    if (!newStatus) {
      return;
    }

    const activity = activities.find(
      (item) => item._id === activityId
    );

    if (
      activity &&
      activity.status === newStatus
    ) {
      return;
    }

    try {
      setError("");

      await updateActivityStatus(
        activityId,
        newStatus
      );

      await loadBoardData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error actualizando estado"
      );
    }
  };

  return (
          <section className="pm-card min-w-0 space-y-5 p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>

          {selectedGoal && (
            <p className="mt-2 text-sm font-medium text-blue-700">
              Meta seleccionada: {selectedGoal.title}
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={workflowType}
            onChange={(event) =>
              setWorkflowType(event.target.value)
            }
            className="pm-input"
            aria-label="Tipo de flujo"
          >
            {WORKFLOW_OPTIONS.map((type) => (
              <option
                key={type.value}
                value={type.value}
              >
                {type.label}
              </option>
            ))}
          </select>

          {showGoalFilter && (
            <select
              value={goalId}
              onChange={(event) =>
                setGoalId(event.target.value)
              }
              className="pm-input"
              aria-label="Filtrar por meta"
            >
              <option value="">
                Todas las metas
              </option>

              {goals.map((goal) => (
                <option
                  key={goal._id}
                  value={goal._id}
                >
                  {goal.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {error && (
         <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <DndContext onDragEnd={handleDragEnd}>
        <div
         className="grid gap-4 overflow-x-auto rounded-2xl bg-slate-100/70 p-3 [-webkit-overflow-scrolling:touch]"
          style={{
            gridTemplateColumns:
              `repeat(${statuses.length}, minmax(min(16rem, 78vw), 1fr))`,
          }}
        >
          {statuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              activities={filteredActivities.filter(
                (activity) =>
                  activity.status === status
              )}
            />
          ))}
        </div>
      </DndContext>
    </section>
  );
};

export default KanbanBoard;
