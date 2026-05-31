import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import api from "../api/axios";

import {
  DndContext,
} from "@dnd-kit/core";

import KanbanColumn
  from "../components/kanban/KanbanColumn";

const STATUSES = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
];

const Kanban = () => {
  const [activities, setActivities] =
    useState([]);

  const loadActivities =
    async () => {
      const response =
        await api.get(
          "/activities"
        );

      setActivities(
        response.data
      );
    };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleDragEnd =
    async (event) => {
      const activityId =
        event.active.id;

      const newStatus =
        event.over?.id;

      if (!newStatus) {
        return;
      }

      await api.patch(
        `/activities/${activityId}/status`,
        {
          status: newStatus,
        }
      );

      loadActivities();
    };

    const [workflowType, setWorkflowType] = useState("STANDARD");

    const response = await api.get(`/activities?workflowType=${workflowType}` );

    useEffect(() => {
  loadActivities();
}, [workflowType]);


  return (
    <MainLayout>
      <h1 className="text-3xl mb-6">
        Kanban
      </h1>

      <DndContext
        onDragEnd={
          handleDragEnd
        }
        
      >
        <div className="grid grid-cols-3 gap-4">
            <select
                value={workflowType}
                onChange={(e) =>
                    setWorkflowType(
                    e.target.value
                    )
                }
                className="border p-2 mb-6"
                >
                <option value="STANDARD">
                    Standard
                </option>

                <option value="SCRUM">
                    Scrum
                </option>

                <option value="KANBAN">
                    Kanban
                </option>

                <option value="MARKETING">
                    Marketing
                </option>

                <option value="CRM">
                    CRM
                </option>
                </select>
          {STATUSES.map(
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