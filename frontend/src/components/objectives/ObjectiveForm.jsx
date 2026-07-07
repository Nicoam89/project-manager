import { useForm } from "react-hook-form";

import AdvancedOptions from "../AdvancedOptions";
import FormField from "../forms/FormField";

const statusOptions = [
  { value: "ACTIVE", label: "Activo" },
  { value: "COMPLETED", label: "Completado" },
  { value: "ARCHIVED", label: "Archivado" },
];

const ObjectiveForm = ({
  onSubmit,
  defaultValues,
  submitLabel = "Crear objetivo",
  submittingLabel = "Creando...",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      status: "ACTIVE",
      progress: 0,
      startDate: "",
      endDate: "",
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="pm-card space-y-4 p-4 sm:p-5"
    >
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Información básica
        </p>

        <FormField
          id="objective-title"
          label="Título"
          required
          error={errors.title?.message}
        >
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="pm-input"
              placeholder="Ej: Mejorar la experiencia de clientes"
              {...register("title", {
                required: "El título es obligatorio",
              })}
            />
          )}
        </FormField>

        <FormField id="objective-end-date" label="Fecha límite">
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="pm-input"
              type="date"
              {...register("endDate")}
            />
          )}
        </FormField>
      </div>

      <AdvancedOptions>
        <FormField id="objective-description" label="Descripción">
          {(fieldProps) => (
            <textarea
              {...fieldProps}
              className="pm-input"
              placeholder="Agrega contexto opcional"
              {...register("description")}
            />
          )}
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField id="objective-status" label="Estado">
            {(fieldProps) => (
              <select
                {...fieldProps}
                className="pm-input"
                {...register("status")}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            )}
          </FormField>

          <FormField
            id="objective-progress"
            label="Progreso (%)"
            error={errors.progress?.message}
            helpText="Indica un avance manual entre 0 y 100."
          >
            {(fieldProps) => (
              <input
                {...fieldProps}
                className="pm-input"
                min="0"
                max="100"
                type="number"
                {...register("progress", {
                  min: {
                    value: 0,
                    message: "El progreso mínimo es 0",
                  },
                  max: {
                    value: 100,
                    message: "El progreso máximo es 100",
                  },
                  valueAsNumber: true,
                })}
              />
            )}
          </FormField>
        </div>

        <FormField id="objective-start-date" label="Fecha de inicio">
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="pm-input"
              type="date"
              {...register("startDate")}
            />
          )}
        </FormField>
      </AdvancedOptions>

      <button
        className="pm-button w-full sm:w-auto"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
};

export default ObjectiveForm;
