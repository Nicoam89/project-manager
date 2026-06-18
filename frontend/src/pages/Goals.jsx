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


import FormField from "../components/forms/FormField";
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
  currentValue: "",
  progress: 0,
  status: "ACTIVE",
};

const goalTypesWithoutTarget = [
  "BOOLEAN",
  "ACTIVITIES",
  "QUALITATIVE",
];

const goalStatuses = [
  { value: "ACTIVE", label: "Activa" },
  { value: "COMPLETED", label: "Completada" },
  { value: "ARCHIVED", label: "Archivada" },
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

      if (!form.currentValue) {
        delete payload.currentValue;
      }


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
        className="pm-card mb-6 space-y-4 p-4 sm:mb-8 sm:p-5"
      >
        <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">
          Nueva meta
        </h2>

        {error && (
         <p className="text-red-700">
            {error}
          </p>
        )}

        <FormField
          id="goal-objective"
          label="Objetivo"
          required
          helpText="Elige el objetivo estratégico al que pertenece esta meta."
        >
          {(fieldProps) => (
            <select
              {...fieldProps}
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
          )}
        </FormField>

        <FormField
          id="goal-title"
          label="Título"
          required
          helpText="Describe el entregable o resultado medible de esta meta."
        >
          {(fieldProps) => (
            <input
              {...fieldProps}
              name="title"
              value={form.title}
              onChange={handleChange}
              className="pm-input"
              placeholder="Título"
              required
            />
          )}
        </FormField>

         <FormField
          id="goal-description"
          label="Descripción"
          helpText="Agrega el contexto necesario para evaluar esta meta."
        >
          {(fieldProps) => (
            <textarea
              {...fieldProps}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="pm-input"
              placeholder="Descripción"
            />
          )}
        </FormField>

        <FormField
          id="goal-type"
          label="Tipo"
          helpText="Selecciona cómo se medirá el cumplimiento de la meta."
        >
          {(fieldProps) => (
            <select
              {...fieldProps}
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
          )}
        </FormField>

         {!goalTypesWithoutTarget.includes(
          form.type
        ) && (
          <FormField
            id="goal-target-value"
            label="Valor objetivo"
            required
            helpText="Indica el valor que permitirá medir si la meta se cumplió."
          >
            {(fieldProps) => (
              <input
                {...fieldProps}
                name="targetValue"
                value={form.targetValue}
                onChange={handleChange}
                className="pm-input"
                placeholder="Valor objetivo"
                required
              />
            )}
          </FormField>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            id="goal-current-value"
            label="Valor actual"
            helpText="Registra el avance cuantitativo actual, si aplica."
          >
            {(fieldProps) => (
              <input
                {...fieldProps}
                name="currentValue"
                value={form.currentValue}
                onChange={handleChange}
                className="pm-input"
                placeholder="Valor actual"
              />
            )}
          </FormField>

          <FormField
            id="goal-progress"
            label="Progreso (%)"
            helpText="Indica un avance manual entre 0 y 100."
          >
            {(fieldProps) => (
              <input
                {...fieldProps}
                name="progress"
                value={form.progress}
                onChange={handleChange}
                className="pm-input"
                min="0"
                max="100"
                type="number"
              />
            )}
          </FormField>

          <FormField
            id="goal-status"
            label="Estado"
            helpText="Controla si la meta sigue activa, se completó o se archivó."
          >
            {(fieldProps) => (
              <select
                {...fieldProps}
                name="status"
                value={form.status}
                onChange={handleChange}
                className="pm-input"
              >
                {goalStatuses.map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              Fecha de inicio
            </span>
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              className="pm-input"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              Fecha de fin
            </span>
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              className="pm-input"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">
            Comentarios
          </span>
          <textarea
            name="comments"
            value={form.comments}
            onChange={handleChange}
            className="pm-input"
            placeholder="Comentarios"
          />
        </label>

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
            Listado de metas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Cada meta se conecta con sus actividades y también puede revisarse en Kanban.
          </p>
        </div>
        {goals.map((goal) => (
          <div
            key={goal._id}
            className="pm-card pm-card-hover p-4 sm:p-5"
          >
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <Link
                  to={`/goals/${goal._id}`}
                  className="text-xl font-semibold text-slate-950 hover:text-blue-700">
                  {goal.title}
                </Link>

                <p className="mt-2 text-sm text-slate-500">
                  {goal.description}
                </p>

                <p className="mt-4 text-sm text-slate-600">
                  Objetivo:{" "}
                  {goal.objective?.title ||
                    "Sin objetivo"}
                </p>

                <p className="text-sm text-slate-600">
                  Tipo: {goal.type}
                </p>
                <p className="text-sm text-slate-600">
                  Inicio: {formatDate(goal.startDate)}
                </p>

                <p className="text-sm text-slate-600">
                  Fin: {formatDate(goal.endDate)}
                </p>

                {goal.comments && (
                  <p className="text-sm text-slate-600">
                    Comentarios: {goal.comments}
                  </p>
                )}

              </div>

              <div className="flex flex-wrap items-center gap-3 sm:block sm:text-right">
                <p className="pm-badge">
                  Progreso: {goal.progress}%
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(goal._id)
                  }
                  className="pm-button pm-button-secondary h-fit px-3 py-1 text-sm sm:mt-3"
                >
                  Eliminar
                </button>
              </div>
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
