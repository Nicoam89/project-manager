import {
  useDroppable,
} from "@dnd-kit/core";

import ActivityCard
  from "./ActivityCard";

const KanbanColumn = ({
  status,
  activities,
}) => {
  const { setNodeRef, isOver } =
    useDroppable({
      id: status,
    });

  return (
    <div
      ref={setNodeRef}
       className={`pm-card flex min-h-[22rem] flex-col p-3 transition-colors sm:min-h-[500px] sm:p-4 ${
        isOver ? "border-blue-300 bg-blue-50/60" : "bg-white/95"
      }`}
    >
      <h2 className="mb-4 flex items-center justify-between gap-3 text-base font-semibold text-slate-950">
        <span className="truncate">{status}</span>
        <span className="pm-badge bg-slate-100 text-slate-700">
          {activities.length}
        </span>
      </h2>

      <div className="flex flex-1 flex-col gap-3 rounded-xl bg-slate-50/70 p-2">
        {activities.length ? (
          activities.map(
            (activity) => (
              <ActivityCard
                key={activity._id}
                activity={activity}
              />
            )
          )
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
            Arrastra actividades aquí
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
