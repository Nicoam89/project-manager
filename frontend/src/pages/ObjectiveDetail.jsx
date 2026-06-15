import { useEffect, useState } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import { getObjectiveDetails } from "../api/objectives";

import MainLayout from "../layouts/MainLayout";

const ObjectiveDetail = () => {
  const { id } = useParams();

  const [data, setData] =
    useState(null);

  useEffect(() => {
    const loadObjective =
      async () => {
        const objectiveData =
          await getObjectiveDetails(id);

        setData(objectiveData);
      };

    loadObjective();
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
      to="/objectives"
      className="text-blue-500"
    >
      ← Volver a objetivos
    </Link>

    <h1 className="text-3xl font-bold mt-4">
      {data.objective.title}
    </h1>

      <p className="mt-2">
        {
          data.objective
            .description
        }
      </p>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="border rounded p-4">
           <h3>Metas</h3>

          <p className="text-3xl">
            {data.stats.goals}
          </p>
        </div>

        <div className="border rounded p-4">
          <h3>Actividades</h3>

          <p className="text-3xl">
            {data.stats.activities}
          </p>
        </div>

        <div className="border rounded p-4">
          <h3>Completadas</h3>

          <p className="text-3xl">
            {
              data.stats
                .completedActivities
            }
          </p>
        </div>
      </div>

      <h2 className="text-2xl mt-8 mb-4">
        Metas
      </h2>

      <div className="space-y-4">
        {data.goals.map((goal) => (
          <div
            key={goal._id}
            className="border rounded p-4"
          >
            <Link
              to={`/goals/${goal._id}`}
              className="text-xl font-semibold text-blue-600"
            >
              {goal.title}
            </Link>

            <p>
              {goal.type}
            </p>

            <p>
              {goal.progress}%
            </p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default ObjectiveDetail;