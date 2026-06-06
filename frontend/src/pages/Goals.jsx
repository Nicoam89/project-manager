import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";

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
    const response =
      await api.get("/goals");

    setGoals(response.data);
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
      await api.post("/goals", {
        ...form,
        targetValue:
          form.type === "BOOLEAN"
            ? true
            : form.targetValue,
      });

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
    await api.delete(`/goals/${id}`);

    await loadGoals();
  };

  return (
    <MainLayout>
      <h1 className="text-3xl mb-6">
        Metas
      </h1>

      <form
        onSubmit={handleSubmit}
        className="border rounded p-4 mb-8 space-y-4"
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
          className="border p-2 w-full"
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
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 w-full"
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

        {form.type !== "BOOLEAN" && (
          <input
            name="targetValue"
            value={form.targetValue}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Valor objetivo"
            required
          />
        )}

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
      </div>
    </MainLayout>
  );
};

export default Goals;