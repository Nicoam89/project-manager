import { URGENCY_SORT_OPTIONS } from "../utils/urgencySort";

const SortByUrgencyControl = ({
  id,
  value,
  onChange,
}) => (
  <label
    htmlFor={id}
    className="flex flex-col gap-1 text-sm font-semibold text-slate-700 sm:min-w-56"
  >
    Ordenar por
    <select
      id={id}
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="pm-input"
    >
      {URGENCY_SORT_OPTIONS.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

export default SortByUrgencyControl;
