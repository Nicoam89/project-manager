import {
  useCallback,
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import api from "../api/axios";

import {
  DndContext,
} from "@dnd-kit/core";

import KanbanColumn
  from "../components/Kanban/KanbanColumn";

import {
  WORKFLOWS,
  WORKFLOW_OPTIONS,
} from "../constants/workflows";

const Kanban = () => {
  const [activities, setActivities] =
    useState([]);

  const [workflowType, setWorkflowType] =
    useState("STANDARD");

  const [error, setError] =
    useState("");

  const statuses =
    WORKFLOWS[workflowType] ||
    WORKFLOWS.STANDARD;


const loadActivities = useCallback(
  async () => {
    try {
      setError("");

      const response =
        await api.get(
          `/activities?workflowType=${workflowType}`
        );

      setActivities(
        response.data
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error cargando actividades"
      );
    }
  },
  [workflowType]
);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleDragEnd =
  async (event) => {
    const activityId =
      event.active.id;

    const newStatus =
      event.over?.id;

    if (!newStatus) {
      return;
    }

    const activity =
      activities.find(
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

      await api.patch(
        `/activities/${activityId}/status`,
        {
          status: newStatus,
        }
      );

      await loadActivities();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error actualizando estado"
      );
    }
  };

  return (
    <MainLayout>
      <h1 className="pm-page-title mb-6">
        Kanban
      </h1>
     {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}

      <select
        value={workflowType}
        onChange={(e) =>
          setWorkflowType(
            e.target.value
          )
        }
        className="border p-2 mb-6"
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

      <DndContext
        onDragEnd={
          handleDragEnd
        }
      >
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns:
              `repeat(${statuses.length}, minmax(16rem, 1fr))`,
          }}
        >
          {statuses.map(
            (status) => (
              <KanbanColumn
                key={status}
                status={status}
                activities={activities.filter(
                  (activity) =>
                    activity.status ===
                    status
                )}
              />
            )
          )}
        </div>
      </DndContext>
    </MainLayout>
  );
};

export default Kanban;
    