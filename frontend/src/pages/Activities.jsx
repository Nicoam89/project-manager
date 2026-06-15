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

import KanbanBoard from "../components/Kanban/KanbanBoard";


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
        className="pm-card mb-6 space-y-4 p-4 sm:mb-8 sm:p-5"
      >
        <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">

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
          className="pm-button"
        >
          {loading
            ? "Guardando..."
            : "Guardar"}
        </button>
      </form>
      <section className="mb-10 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            Listado de actividades
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las actividades en lista o arrástralas en la vista Kanban.
          </p>
        </div>


       <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity._id}
              className="pm-card pm-card-hover p-4 sm:p-5"
          >
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <Link
                  to={`/activities/${activity._id}`}
                  className="text-xl font-semibold text-slate-950 hover:text-blue-700"
                >
                  {activity.title}
                </Link>

                <p className="mt-2 text-sm text-slate-500">
                  {activity.description}
                </p>

                <p className="mt-4 text-sm text-slate-600">
                  Meta:{" "}
                  {activity.goal?.title ||
                    "Sin meta"}
                </p>

                <p className="text-sm text-slate-600">
                  Flujo: {activity.workflowType}
                </p>

                <p className="text-sm text-slate-600">
                  Estado: {activity.status}
                </p>
              </div>

              <div className="flex flex-col gap-1 sm:items-end">
                <p className="text-sm text-slate-600">
                  Inicio: {formatDate(activity.startDate)}
                </p>

                <p className="text-sm text-slate-600">
                  Fin: {formatDate(activity.dueDate)}
                </p>

                {activity.comments?.[0]?.text && (
                  <p className="text-sm text-slate-600">
                    Comentarios: {activity.comments[0].text}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(activity._id)
                  }
                  className="pm-button pm-button-secondary mt-2 h-fit px-3 py-1 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      </section>

      <KanbanBoard
        title="Kanban de actividades"
        description="Mueve actividades por estado y filtra por meta desde esta misma sección."
      />
    </MainLayout>
  );
};

export default Activities;
