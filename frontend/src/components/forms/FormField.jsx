import FieldError from "./FieldError";
import RequiredMark from "./RequiredMark";

const FormField = ({
  children,
  error,
  helpText,
  id,
  label,
  required = false,
}) => {
  const errorId = error
    ? `${id}-error`
    : undefined;
  const helpId = helpText
    ? `${id}-help`
    : undefined;

  return (
    <div>
      <label
        className="mb-1 block text-sm font-semibold text-slate-700"
        htmlFor={id}
      >
        {label}
        {required ? <RequiredMark /> : null}
      </label>

      {children({
        "aria-describedby": [
          helpId,
          errorId,
        ]
          .filter(Boolean)
          .join(" ") || undefined,
        "aria-invalid": error
          ? "true"
          : "false",
        "aria-required": required
          ? "true"
          : undefined,
        id,
      })}

      {helpText ? (
        <p
          id={helpId}
          className="mt-2 text-sm text-slate-500"
        >
          {helpText}
        </p>
      ) : null}

      <FieldError id={errorId}>
        {error}
      </FieldError>
    </div>
  );
};

export default FormField;
