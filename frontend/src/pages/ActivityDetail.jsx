import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";

import TimeEntryForm from "../components/activities/TimeEntryForm";

const ActivityDetail = () => {
  const { id } = useParams();

  const [data, setData] =
    useState(null);

  const loadActivity = useCallback(
    async () => {
      const response =
        await api.get(
          `/activities/${id}/details`
        );

      setData(response.data);
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
      <h1 className="text-3xl font-bold">
        {data.activity.title}
      </h1>

      <p className="mt-2">
        {data.activity.description}
      </p>

      <div className="grid grid-cols-4 gap-4 mt-6">
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

      <div className="mt-8 max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Registrar tiempo
        </h2>

        <TimeEntryForm
          onSubmit={addTime}
        />
      </div>
    </MainLayout>
  );
};

export default ActivityDetail;