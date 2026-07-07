import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import SortByUrgencyControl from "../components/SortByUrgencyControl";

import useObjectiveStore from "../store/objectiveStore";

import ObjectiveForm from "../components/objectives/ObjectiveForm";

import ObjectiveGrid from "../components/objectives/ObjectiveGrid";
import { sortItems } from "../utils/urgencySort";

const Objectives = () => {
  const { objectives, loadObjectives, createObjective, deleteObjective } =
    useObjectiveStore();

  const [sortBy, setSortBy] = useState("createdAt");

  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadObjectives();
  }, [loadObjectives]);

  const handleCreate = async (data) => {
    await createObjective(data);

    loadObjectives();
    setShowCreateForm(false);
  };

  const handleDelete = async (id) => {
    await deleteObjective(id);

    loadObjectives();
  };

  const sortedObjectives = sortItems(objectives, {
    dueDateField: "endDate",
    sortBy,
  });

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="pm-page-title mb-2">Objetivos</h1>
          <p className="text-sm text-slate-500">Define grandes resultados.</p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm((current) => !current)}
          className="pm-button w-full sm:w-auto"
          aria-expanded={showCreateForm}
          aria-controls="objective-create-form"
        >
          {showCreateForm ? "Cerrar" : "+ Nuevo objetivo"}
        </button>
      </div>

      {showCreateForm && (
        <div id="objective-create-form" className="mb-6 sm:mb-8">
          <ObjectiveForm onSubmit={handleCreate} />
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <SortByUrgencyControl
          id="objectives-sort-by"
          value={sortBy}
          onChange={setSortBy}
        />
      </div>

      <ObjectiveGrid objectives={sortedObjectives} onDelete={handleDelete} />
    </MainLayout>
  );
};

export default Objectives;
