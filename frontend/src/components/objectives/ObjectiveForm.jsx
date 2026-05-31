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
      className="space-y-4"
    >
      <input
        className="border p-2 w-full"
        placeholder="Título"
        {...register("title")}
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Descripción"
        {...register(
          "description"
        )}
      />

      <button
        className="border px-4 py-2"
        type="submit"
      >
        Guardar
      </button>
    </form>
  );
};

export default ObjectiveForm;