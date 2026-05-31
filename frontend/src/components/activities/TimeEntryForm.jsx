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
      className="space-y-2"
    >
      <input
        className="border p-2 w-full"
        placeholder="Descripción"
        {...register(
          "description"
        )}
      />

      <input
        type="number"
        step="0.1"
        className="border p-2 w-full"
        placeholder="Horas"
        {...register("hours")}
      />

      <button
        type="submit"
        className="border px-4 py-2"
      >
        Registrar
      </button>
    </form>
  );
};

export default TimeEntryForm;