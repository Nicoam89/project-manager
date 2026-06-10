export const ACTIVITY_STATUS = Object.freeze({
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
});

export const ACTIVITY_STATUSES = Object.freeze(
  Object.values(ACTIVITY_STATUS)
);

export const isCompletedActivityStatus = (
  status
) => status === ACTIVITY_STATUS.COMPLETED;
