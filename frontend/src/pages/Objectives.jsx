import { useEffect } from "react";

import MainLayout from "../layouts/MainLayout";

import useObjectiveStore from "../store/objectiveStore";

import ObjectiveForm from "../components/objectives/ObjectiveForm";

import ObjectiveGrid from "../components/objectives/ObjectiveGrid";

const Objectives = () => {
  const {
    objectives,
    loadObjectives,
    createObjective,
    deleteObjective,
  } = useObjectiveStore();

  useEffect(() => {
    loadObjectives();
  }, []);

  const handleCreate =
    async (data) => {
      await createObjective(data);

      loadObjectives();
    };

  const handleDelete =
    async (id) => {
      await deleteObjective(id);

      loadObjectives();
    };

  return (
    <MainLayout>
      <h1 className="text-3xl mb-6">
        Objetivos
      </h1>

      <div className="mb-8">
        <ObjectiveForm
          onSubmit={handleCreate}
        />
      </div>

      <ObjectiveGrid
        objectives={objectives}
        onDelete={handleDelete}
      />
    </MainLayout>
  );
};

export default Objectives;