import {
  useForm,
} from "react-hook-form";

import FormField from "../forms/FormField";

const TimeEntryForm = ({
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm();

  const submit = async (
    data
  ) => {
    await onSubmit(data);

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(
        submit
      )}
      className="space-y-4"
    >
      <FormField
        id="time-entry-description"
        label="Descripción"
        required
        error={errors.description?.message}
      >
        {(fieldProps) => (
          <input
            {...fieldProps}
            className="pm-input"
            placeholder="Ej. Reunión de seguimiento"
            {...register(
              "description",
              {
                required:
                  "La descripción es obligatoria",
              }
            )}
          />
        )}
      </FormField>

      <FormField
        id="time-entry-hours"
        label="Horas"
        required
        error={errors.hours?.message}
      >
        {(fieldProps) => (
          <input
            {...fieldProps}
            type="number"
            step="0.1"
            min="0.1"
            className="pm-input"
            placeholder="Ej. 1.5"
            {...register("hours", {
              required:
                "Las horas son obligatorias",
              min: {
                value: 0.1,
                message:
                  "Las horas deben ser mayores a 0",
              },
              valueAsNumber: true,
            })}
          />
        )}
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="pm-button w-full"
      >
        {isSubmitting
          ? "Registrando..."
          : "Registrar tiempo"}
      </button>
    </form>
  );
};

export default TimeEntryForm;
