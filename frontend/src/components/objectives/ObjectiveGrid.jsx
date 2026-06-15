import ObjectiveCard from "./ObjectiveCard";

const ObjectiveGrid = ({
  objectives,
  onDelete,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {objectives.map(
        (objective) => (
          <ObjectiveCard
            key={objective._id}
            objective={objective}
            onDelete={onDelete}
          />
        )
      )}
    </div>
  );
};

export default ObjectiveGrid;