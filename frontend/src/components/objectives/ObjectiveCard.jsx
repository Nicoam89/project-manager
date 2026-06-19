import { Link } from "react-router-dom";
import { calculateDueUrgency } from "../../../../shared/dueUrgency.js";
import { getDueUrgencyClass } from "../../utils/dueUrgency";

const ObjectiveCard = ({
  objective,
  onDelete,
}) => {
  const dueUrgency = calculateDueUrgency(
    objective.endDate
  );

  return (
    <div className="pm-card pm-card-hover p-4 sm:p-5">
      <h3 className="text-xl font-semibold">
        {objective.title}
      </h3>

      <p className="text-gray-500 mt-2">
        {objective.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm">
          {objective.status}
        </span>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDueUrgencyClass(
            dueUrgency.urgency
          )}`}
        >
          Urgencia: {dueUrgency.label}
        </span>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full"
            style={{
              width: `${objective.progress}%`,
            }}
          />
        </div>

        <span className="text-sm">
          {objective.progress}%
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button className="pm-button pm-button-secondary w-full sm:w-auto">
          Editar
        </button>

        <button
          onClick={() =>
            onDelete(objective._id)
          }
          className="pm-button pm-button-secondary w-full sm:w-auto"
        >
          Eliminar
        </button>
      </div>
        <Link to={`/objectives/${objective._id}`}>
            <h3 className="text-xl font-semibold"> {objective.title}
        </h3>
        </Link>

    </div>
  );
};

export default ObjectiveCard;