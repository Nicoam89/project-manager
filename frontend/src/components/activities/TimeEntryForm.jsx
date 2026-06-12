import {
  useForm,
} from "react-hook-form";

const TimeEntryForm = ({
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
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
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Descripción
        </span>

        <input
          className="pm-input"
          placeholder="Ej. Reunión de seguimiento"
          required
          {...register(
            "description",
            { required: true }
          )}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Horas
        </span>

        <input
          type="number"
          step="0.1"
          min="0.1"
          className="pm-input"
          placeholder="Ej. 1.5"
          required
          {...register("hours", {
            required: true,
            valueAsNumber: true,
          })}
        />
      </label>

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
