import { Link } from "react-router-dom";

const ObjectiveCard = ({
  objective,
  onDelete,
}) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-semibold">
        {objective.title}
      </h3>

      <p className="text-gray-500 mt-2">
        {objective.description}
      </p>

      <div className="mt-4">
        <span className="text-sm">
          {objective.status}
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

      <div className="mt-4 flex gap-2">
        <button className="border px-3 py-1 rounded">
          Editar
        </button>

        <button
          onClick={() =>
            onDelete(objective._id)
          }
          className="border px-3 py-1 rounded"
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