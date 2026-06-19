import { calculateDueUrgency } from "../../../shared/dueUrgency.js";

export const getDueUrgency = (activity) =>
  activity?.dueUrgency ||
  calculateDueUrgency(activity?.dueDate);

export const getDueUrgencyClass = (urgency) => {
  switch (urgency) {
    case "OVERDUE":
      return "border-red-200 bg-red-50 text-red-700";
    case "DUE_TODAY":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "DUE_SOON":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "UPCOMING":
      return "border-slate-200 bg-slate-50 text-slate-600";
    default:
      return "border-slate-200 bg-white text-slate-500";
  }
};
