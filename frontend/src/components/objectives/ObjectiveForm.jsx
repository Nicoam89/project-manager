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
     <div>
        <label
          className="mb-1 block text-sm font-semibold text-slate-700"
          htmlFor="objective-title"
        >
          Título
        </label>
        <input
          id="objective-title"
          className="pm-input"
          placeholder="Título"
          {...register("title")}
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-semibold text-slate-700"
          htmlFor="objective-description"
        >
          Descripción
        </label>
        <textarea
          id="objective-description"
          className="pm-input"
          placeholder="Descripción"
          {...register(
            "description"
          )}
        />
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