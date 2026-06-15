import { Link } from "react-router-dom";

import {
  useDraggable,
} from "@dnd-kit/core";

const ActivityCard = ({
  activity,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: activity._id,
  });

  const style = {
    transform: transform
      ? `translate3d(
          ${transform.x}px,
          ${transform.y}px,
          0
        )`
      : undefined,
  };
 const priorityClass =
    priorityColors[activity.priority] ||
    priorityColors.MEDIUM;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${priorityClass} ${
        isDragging ? "z-10 opacity-80 shadow-lg" : ""
      }`}
    >
      <Link
        to={`/activities/${activity._id}`}
        className="text-base font-semibold text-slate-950 hover:text-blue-700"
      >
        {activity.title}
      </Link>

      {activity.goal?.title && (
        <p className="mt-2 text-xs font-medium text-slate-500">
          {activity.goal.title}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="pm-badge bg-blue-50 text-blue-700">
          {activity.priority || "MEDIUM"}
        </span>
        <span className="text-xs text-slate-400">
          Arrastrar
        </span>
      </div>
    </div>
  );
};

const priorityColors = {
  LOW:
    "border-l-4 border-l-slate-300",

  MEDIUM:
    "border-l-4 border-l-blue-400",

  HIGH:
    "border-l-4 border-l-amber-400",

  URGENT:
    "border-l-4 border-l-red-500",
};

export default ActivityCard;
