import { calculateDueUrgency } from "../../../shared/dueUrgency.js";

export const URGENCY_SORT_OPTIONS = [
  {
    value: "createdAt",
    label: "Más recientes",
  },
  {
    value: "urgencyDesc",
    label: "Urgencia: mayor a menor",
  },
  {
    value: "urgencyAsc",
    label: "Urgencia: menor a mayor",
  },
];

export const getItemDueUrgency = (
  item,
  dueDateField
) =>
  item?.dueUrgency ||
  calculateDueUrgency(item?.[dueDateField]);

const compareByCreatedAt = (first, second) =>
  new Date(second.createdAt || 0).getTime() -
  new Date(first.createdAt || 0).getTime();

export const sortByUrgency = (
  items,
  {
    dueDateField,
    direction = "desc",
  }
) => {
  const directionMultiplier =
    direction === "asc" ? 1 : -1;

  return [...items].sort((first, second) => {
    const firstUrgency =
      getItemDueUrgency(first, dueDateField);
    const secondUrgency =
      getItemDueUrgency(second, dueDateField);
    const scoreDifference =
      firstUrgency.score - secondUrgency.score;

    if (scoreDifference !== 0) {
      return scoreDifference * directionMultiplier;
    }

    return compareByCreatedAt(first, second);
  });
};

export const sortItems = (
  items,
  {
    dueDateField,
    sortBy,
  }
) => {
  if (sortBy === "urgencyDesc") {
    return sortByUrgency(items, {
      dueDateField,
      direction: "desc",
    });
  }

  if (sortBy === "urgencyAsc") {
    return sortByUrgency(items, {
      dueDateField,
      direction: "asc",
    });
  }

  return [...items].sort(compareByCreatedAt);
};
