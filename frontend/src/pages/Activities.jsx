import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";

const workflowTypes = [
  {
    value: "STANDARD",
    label: "Standard",
  },
  {
    value: "SCRUM",
    label: "Scrum",
  },
  {
    value: "KANBAN",
    label: "Kanban",
  },
  {
    value: "MARKETING",
    label: "Marketing",
  },
  {
    value: "CRM",
    label: "CRM",
  },
];

const initialForm = {
  goal: "",
  title: "",
  description: "",
  workflowType: "STANDARD",
};

const Activities = () => {
  const [activities, setActivities] =
    useState([]);

  const [goals, setGoals] =
    useState([]);

  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadActivities = async () => {
    const response =
      await api.get("/activities");

    setActivities(response.data);
  };

  const loadGoals = async () => {
    const response =
      await api.get("/goals");

    setGoals(response.data);
  };

  useEffect(() => {
    loadActivities();
    loadGoals();
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post(
        "/activities",
        form
      );

      setForm(initialForm);

      await loadActivities();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error creando la actividad"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(
      `/activities/${id}`
    );

    await loadActivities();
  };

  return (
    <MainLayout>
      <h1 className="text-3xl mb-6">
        Actividades
      </h1>

      <form
        onSubmit={handleSubmit}
        className="border rounded p-4 mb-8 space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Nueva actividad
        </h2>

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        <select
          name="goal"
          value={form.goal}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">
            Selecciona una meta
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

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Título"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Descripción"
        />

        <select
          name="workflowType"
          value={form.workflowType}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          {workflowTypes.map((workflowType) => (
            <option
              key={workflowType.value}
              value={workflowType.value}
            >
              {workflowType.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="border px-4 py-2 rounded"
        >
          {loading
            ? "Guardando..."
            : "Guardar"}
        </button>
      </form>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="border rounded p-4"
          >
            <div className="flex justify-between gap-4">
              <div>
                <Link
                  to={`/activities/${activity._id}`}
                  className="text-xl font-semibold"
                >
                  {activity.title}
                </Link>

                <p className="text-gray-500">
                  {activity.description}
                </p>

                <p className="text-sm mt-2">
                  Meta:{" "}
                  {activity.goal?.title ||
                    "Sin meta"}
                </p>

                <p className="text-sm">
                  Flujo: {activity.workflowType}
                </p>

                <p className="text-sm">
                  Estado: {activity.status}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleDelete(activity._id)
                }
                className="border px-3 py-1 rounded h-fit"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Activities;