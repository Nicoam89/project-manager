import {
  useDroppable,
} from "@dnd-kit/core";

import ActivityCard
  from "./ActivityCard";

const KanbanColumn = ({
  status,
  activities,
}) => {
  const { setNodeRef } =
    useDroppable({
      id: status,
    });

  return (
    <div
      ref={setNodeRef}
      className="border rounded p-4 min-h-[500px]"
    >
      <h2 className="font-bold mb-4">
        {status}
      </h2>

      {activities.map(
        (activity) => (
          <ActivityCard
            key={activity._id}
            activity={activity}
          />
        )
      )}
    </div>
  );
};

export default KanbanColumn;