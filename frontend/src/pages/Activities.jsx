import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  createActivity,
  deleteActivity,
  getActivities,
} from "../api/activities";
import { getGoals } from "../api/goals";

import MainLayout from "../layouts/MainLayout";

import {
  WORKFLOW_OPTIONS,
} from "../constants/workflows";

const initialForm = {
  goal: "",
  title: "",
  description: "",
  workflowType: "STANDARD",
  startDate: "",
  dueDate: "",
  comments: "",
};

const formatDate = (date) => {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
  }).format(new Date(date));

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
    const activitiesData =
      await getActivities();

    setActivities(activitiesData);
  };

  const loadGoals = async () => {
    const goalsData =
      await getGoals();

    setGoals(goalsData);
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
 await createActivity({
        ...form,
        comments: form.comments
          ? [
              {
                text: form.comments,
              },
            ]
          : [],
      });

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
    await deleteActivity(id)

    await loadActivities();
  };

  return (
    <MainLayout>
      <h1 className="pm-page-title mb-6">
        Actividades
      </h1>

      <form
        onSubmit={handleSubmit}
        className="pm-card mb-8 space-y-4 p-5"
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
          className="pm-input"
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
          className="pm-input"
          placeholder="Título"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="pm-input"
          placeholder="Descripción"
        />

        <select
          name="workflowType"
          value={form.workflowType}
          onChange={handleChange}
          className="pm-input"
        >
          {WORKFLOW_OPTIONS.map((workflowType) => (
            <option
              key={workflowType.value}
              value={workflowType.value}
            >
              {workflowType.label}
            </option>
          ))}
        </select>
 <div className="grid gap-4 md:grid-cols-2">
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            className="pm-input"
            aria-label="Fecha de inicio"
          />

          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="pm-input"
            aria-label="Fecha de fin"
          />
        </div>

        <textarea
          name="comments"
          value={form.comments}
          onChange={handleChange}
          className="pm-input"
          placeholder="Comentarios"
        />

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
                     <p className="text-sm">
                  Inicio: {formatDate(activity.startDate)}
                </p>

                <p className="text-sm">
                  Fin: {formatDate(activity.dueDate)}
                </p>

                {activity.comments?.[0]?.text && (
                  <p className="text-sm">
                    Comentarios: {activity.comments[0].text}
                  </p>
                )}

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