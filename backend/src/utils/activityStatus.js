export const ACTIVITY_STATUS = Object.freeze({
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
});

export const ACTIVITY_STATUSES = Object.freeze(
  Object.values(ACTIVITY_STATUS)
);

const COMPLETED_WORKFLOW_STATUSES = new Set([
  ACTIVITY_STATUS.COMPLETED,
  "ACCEPTED",
  "CLOSED",
  "WON",
]);

export const isCompletedActivityStatus = (status) =>
  COMPLETED_WORKFLOW_STATUSES.has(status);
