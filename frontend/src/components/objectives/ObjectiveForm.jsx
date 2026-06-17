import { useForm } from "react-hook-form";

import FormField from "../forms/FormField";

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
    defaultValues,
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
