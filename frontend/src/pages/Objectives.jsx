import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";
import SortByUrgencyControl from "../components/SortByUrgencyControl";

import useObjectiveStore from "../store/objectiveStore";

import ObjectiveForm from "../components/objectives/ObjectiveForm";

import ObjectiveGrid from "../components/objectives/ObjectiveGrid";
import { sortItems } from "../utils/urgencySort";

const Objectives = () => {
  const {
    objectives,
    loadObjectives,
    createObjective,
    deleteObjective,
  } = useObjectiveStore();

  const [sortBy, setSortBy] =
    useState("createdAt");

  useEffect(() => {
    loadObjectives();
  }, [loadObjectives]);

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

  const sortedObjectives = sortItems(objectives, {
    dueDateField: "endDate",
    sortBy,
  });

  return (
    <MainLayout>
      <h1 className="pm-page-title mb-5 sm:mb-6">
        Objetivos
      </h1>

      <div className="mb-6 sm:mb-8">
        <ObjectiveForm
          onSubmit={handleCreate}
        />
      </div>

      <div className="mb-4 flex justify-end">
        <SortByUrgencyControl
          id="objectives-sort-by"
          value={sortBy}
          onChange={setSortBy}
        />
      </div>

      <ObjectiveGrid
        objectives={sortedObjectives}
        onDelete={handleDelete}
      />
    </MainLayout>
  );
};

export default Objectives;
