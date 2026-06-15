import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  createGoal,
  deleteGoal,
  getGoals,
} from "../api/goals";


import MainLayout from "../layouts/MainLayout";

import KanbanBoard from "../components/Kanban/KanbanBoard";

import useObjectiveStore from "../store/objectiveStore";

const goalTypes = [
  {
    value: "BOOLEAN",
    label: "Sí / No",
  },
  {
    value: "MONETARY",
    label: "Monetaria",
  },
  {
    value: "HOURS",
    label: "Horas",
  },
  {
    value: "QUALITATIVE",
    label: "Cualitativa",
  },
  {
    value: "ACTIVITIES",
    label: "Actividades",
  },
];

const initialForm = {
  objective: "",
  title: "",
  description: "",
  type: "ACTIVITIES",
  targetValue: "",
startDate: "",
  endDate: "",
  comments: "",
};

const goalTypesWithoutTarget = [
  "BOOLEAN",
  "ACTIVITIES",
  "QUALITATIVE",
];

const formatDate = (date) => {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
  }).format(new Date(date));
};


const Goals = () => {
  const [goals, setGoals] =
    useState([]);

  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const {
    objectives,
    loadObjectives,
  } = useObjectiveStore();

  const loadGoals = async () => {
      const goalsData =
      await getGoals();

    setGoals(goalsData);

  };

  useEffect(() => {
    loadGoals();
    loadObjectives();
  }, [loadObjectives]);

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
      const payload = {
        ...form,
        targetValue:
          form.type === "BOOLEAN"
            ? true
            : form.targetValue,
        };

      if (
        goalTypesWithoutTarget.includes(
          form.type
        ) &&
        form.type !== "BOOLEAN"
      ) {
        delete payload.targetValue;
      }

      await createGoal(payload);

      setForm(initialForm);

      await loadGoals();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error creando la meta"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteGoal(id);

    await loadGoals();
  };

  return (
    <MainLayout>
      <h1 className="pm-page-title mb-6">
        Metas
      </h1>

      <form
        onSubmit={handleSubmit}
        className="pm-card mb-8 space-y-4 p-5"
      >
        <h2 className="text-xl font-semibold">
          Nueva meta
        </h2>

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        <select
          name="objective"
          value={form.objective}
          onChange={handleChange}
          className="pm-input"
          required
        >
          <option value="">
            Selecciona un objetivo
          </option>

          {objectives.map((objective) => (
            <option
              key={objective._id}
              value={objective._id}
            >
              {objective.title}
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
          name="type"
          value={form.type}
          onChange={handleChange}
          className="pm-input"
        >
          {goalTypes.map((type) => (
            <option
              key={type.value}
              value={type.value}
            >
              {type.label}
            </option>
          ))}
        </select>

         {!goalTypesWithoutTarget.includes(
          form.type
        ) && (
          <input
            name="targetValue"
            value={form.targetValue}
            onChange={handleChange}
            className="pm-input"
            placeholder="Valor objetivo"
            required
          />
        )}
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
            name="endDate"
            type="date"
            value={form.endDate}
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

      <section className="mb-10 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            Listado de metas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Cada meta se conecta con sus actividades y también puede revisarse en Kanban.
          </p>
        </div>
        {goals.map((goal) => (
          <div
            key={goal._id}
            className="border rounded p-4"
          >
            <div className="flex justify-between gap-4">
              <div>
                <Link
                  to={`/goals/${goal._id}`}
                  className="text-xl font-semibold">
                  {goal.title}
                </Link>

                <p className="text-gray-500">
                  {goal.description}
                </p>

                <p className="text-sm mt-2">
                  Objetivo:{" "}
                  {goal.objective?.title ||
                    "Sin objetivo"}
                </p>

                <p className="text-sm">
                  Tipo: {goal.type}
                </p>
                <p className="text-sm">
                  Inicio: {formatDate(goal.startDate)}
                </p>

                <p className="text-sm">
                  Fin: {formatDate(goal.endDate)}
                </p>

                {goal.comments && (
                  <p className="text-sm">
                    Comentarios: {goal.comments}
                  </p>
                )}

                <p className="text-sm">
                  Progreso: {goal.progress}%
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleDelete(goal._id)
                }
                className="border px-3 py-1 rounded h-fit"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </section>

      <KanbanBoard
        title="Kanban de metas"
        description="Visualiza las actividades asociadas a tus metas por estado, sin salir de la sección Metas."
      />
    </MainLayout>
  );
};

export default Goals;