import { useForm } from "react-hook-form";

const ObjectiveForm = ({
  onSubmit,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
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
      <input
        className="pm-input"
        placeholder="Título"
        {...register("title")}
      />

      <textarea
        className="pm-input"
        placeholder="Descripción"
        {...register(
          "description"
        )}
      />

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