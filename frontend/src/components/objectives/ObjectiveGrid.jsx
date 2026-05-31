import ObjectiveCard from "./ObjectiveCard";

const ObjectiveGrid = ({
  objectives,
  onDelete,
}) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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