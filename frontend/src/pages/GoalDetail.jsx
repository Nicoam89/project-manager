import { useEffect, useState } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";

const GoalDetail = () => {
  const { id } = useParams();

  const [data, setData] =
    useState(null);

  useEffect(() => {
    const loadGoal =
      async () => {
        const response =
          await api.get(
            `/goals/${id}/details`
          );

        setData(response.data);
      };

    loadGoal();
  }, [id]);

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
          to="/goals"
          className="text-blue-500"
        >
          ← Volver a metas
        </Link>
        <h1 className="text-3xl font-bold mt-4">
          {data.goal.title}
        </h1>

      <p className="mt-2">
        {data.goal.description}
      </p>

      {data.goal.objective && (
        <p className="mt-2">
          Objetivo:{" "}
          <Link
            to={`/objectives/${data.goal.objective._id}`}
            className="text-blue-600"
          >
            {data.goal.objective.title}
          </Link>
        </p>
)}
      <div className="mt-6">
        <div className="w-full bg-gray-200 h-4 rounded">
          <div
            className="bg-green-500 h-4 rounded"
            style={{
              width:
                `${data.stats.progress}%`,
            }}
          />
        </div>

        <p className="mt-2">
          {data.stats.progress}%
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="border p-4 rounded">
          Actividades

          <p className="text-3xl">
            {
              data.stats
                .activities
            }
          </p>
        </div>

        <div className="border p-4 rounded">
          Completadas

          <p className="text-3xl">
            {
              data.stats
                .completedActivities
            }
          </p>
        </div>

        <div className="border p-4 rounded">
          Pendientes

          <p className="text-3xl">
            {
              data.stats
                .pendingActivities
            }
          </p>
        </div>
      </div>

      <h2 className="text-2xl mt-8">
        Actividades
      </h2>

      <div className="space-y-3 mt-4">
        {data.activities.map(
          (activity) => (
            <div
              key={activity._id}
              className="border rounded p-4"
            >
            <Link
              to={`/activities/${activity._id}`}
              className="text-xl font-semibold text-blue-600"
            >
              {activity.title}
            </Link>
              <p>
                {
                  activity.status
                }
              </p>

              <p>
                {
                  activity.priority
                }
              </p>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
};

export default GoalDetail;