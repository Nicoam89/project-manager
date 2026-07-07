import { Link } from "react-router-dom";

import { calculateDueUrgency } from "../../../../shared/dueUrgency.js";
import { getDueUrgencyClass } from "../../utils/dueUrgency";

const ObjectiveCard = ({ objective, onDelete }) => {
  const dueUrgency = calculateDueUrgency(objective.endDate);

  return (
    <article className="pm-card pm-card-hover p-4 sm:p-5">
      <Link
        to={`/objectives/${objective._id}`}
        className="block text-xl font-semibold text-slate-950 hover:text-blue-700"
      >
        {objective.title}
      </Link>

      {objective.description ? (
        <p className="mt-2 text-sm text-slate-500">{objective.description}</p>
      ) : (
        <p className="mt-2 text-sm text-slate-400">Sin descripción.</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="pm-badge">{objective.status}</span>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDueUrgencyClass(
            dueUrgency.urgency,
          )}`}
        >
          Urgencia: {dueUrgency.label}
        </span>
      </div>

      <div className="mt-4">
        <div className="h-3 w-full rounded-full bg-slate-200">
          <div
            className="h-3 rounded-full bg-blue-500"
            style={{
              width: `${objective.progress}%`,
            }}
          />
        </div>

        <span className="mt-2 block text-sm text-slate-600">
          Progreso: {objective.progress}%
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          to={`/objectives/${objective._id}`}
          className="pm-button pm-button-secondary w-full sm:w-auto"
        >
          Ver detalle
        </Link>

        <button
          type="button"
          onClick={() => onDelete(objective._id)}
          className="pm-button pm-button-secondary w-full sm:w-auto"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
};

export default ObjectiveCard;