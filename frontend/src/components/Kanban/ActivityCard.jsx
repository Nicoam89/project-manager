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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border rounded p-3 mb-2 bg-white cursor-grab"
    >
      <h3>
        {activity.title}
      </h3>

      <p className="text-sm">
        {
          activity.priority
        }
      </p>
    </div>
  );
};


const priorityColors = {
  LOW:
    "border-gray-300",

  MEDIUM:
    "border-blue-400",

  HIGH:
    "border-orange-400",

  URGENT:
    "border-red-500",
};

export default ActivityCard;