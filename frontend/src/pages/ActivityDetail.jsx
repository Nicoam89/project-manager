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
        Cargando...
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Link
          to="/activities"
          className="text-blue-500"
        >
          ← Volver a actividades
        </Link>
      <h1 className="text-3xl font-bold">
        {data.activity.title}
      </h1>

      <p className="mt-2">
        {error && (
            <p className="text-red-500 mt-4">
              {error}
            </p>
          )}
        {data.activity.description}
        {data.activity.goal && (
          <p className="mt-2">
            Meta:{" "}
            <Link
              to={`/goals/${data.activity.goal._id}`}
              className="text-blue-600"
            >
              {data.activity.goal.title}
            </Link>
          </p>
        )}
      </p>

      <div className="grid grid-cols-5 gap-4 mt-6">
        <div className="border p-4 rounded">
          Horas

          <p className="text-2xl">
            {data.stats.trackedHours}
          </p>
        </div>

        <div className="border p-4 rounded">
          Comentarios

          <p className="text-2xl">
            {data.stats.comments}
          </p>
        </div>

        <div className="border p-4 rounded">
          Subtareas

          <p className="text-2xl">
            {data.stats.completedSubtasks}
            /
            {data.stats.subtasks}
          </p>
        </div>

        <div className="border p-4 rounded">
          Estado

          <p className="text-2xl">
            {data.activity.status}
          </p>
        </div>
      </div>
          <div className="border p-4 rounded">
          Flujo

          <p className="text-2xl">
            {data.activity.workflowType}
          </p>
        </div>
      <div className="mt-8 max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Registrar tiempo
        </h2>
        <div className="mt-8">
          <div className="space-y-2">
            {data.activity.timeEntries.map(
              (entry) => (
                <div
                  key={entry._id}
                  className="border rounded p-3"
                >
                  <p>
                    {entry.description}
                  </p>

                  <p className="text-sm text-gray-500">
                    {entry.hours} horas
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        <TimeEntryForm
          onSubmit={addTime}
        />
      </div>
    </MainLayout>
  );
};

export default ActivityDetail;