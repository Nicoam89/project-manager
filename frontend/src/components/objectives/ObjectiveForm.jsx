import { useForm } from "react-hook-form";

import FormField from "../forms/FormField";

const statusOptions = [
  { value: "ACTIVE", label: "Activo" },
  { value: "COMPLETED", label: "Completado" },
  { value: "ARCHIVED", label: "Archivado" },
];

const ObjectiveForm = ({
  onSubmit,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
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
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="pm-card space-y-4 p-4 sm:p-5"
    >
      <FormField
        id="objective-title"
        label="Título"
        required
        error={errors.title?.message}
        helpText="Define el resultado principal del objetivo."
      >
        {(fieldProps) => (
          <input
            {...fieldProps}
            className="pm-input"
            placeholder="Título"
            {...register("title", {
              required: "El título es obligatorio",
            })}
          />
        )}
      </FormField>

      <FormField
        id="objective-description"
        label="Descripción"
        helpText="Agrega contexto para entender el alcance del objetivo."
      >
        {(fieldProps) => (
          <textarea
            {...fieldProps}
            className="pm-input"
            placeholder="Descripción"
            {...register(
              "description"
            )}
          />
        )}
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          id="objective-status"
          label="Estado"
          helpText="Actualiza el estado operativo del objetivo."
        >
          {(fieldProps) => (
            <select
              {...fieldProps}
              className="pm-input"
              {...register("status")}
            >
              {statusOptions.map((status) => (
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

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          id="objective-start-date"
          label="Fecha de inicio"
          helpText="Indica cuándo inicia el objetivo."
        >
          {(fieldProps) => (
            <input
              {...fieldProps}
              className="pm-input"
              type="date"
              {...register("startDate")}
            />
          )}
        </FormField>

        <FormField
          id="objective-end-date"
          label="Fecha de fin"
          helpText="Define el vencimiento para calcular su urgencia."
        >
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

      <button
        className="pm-button w-full sm:w-auto"
        type="submit"
      >
        Guardar
      </button>
    </form>
  );
};

export default ObjectiveForm;
