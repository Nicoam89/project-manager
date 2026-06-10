export const WORKFLOWS = {
  STANDARD: [
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
  ],

  SCRUM: [
    "OPEN",
    "PENDING",
    "IN_PROGRESS",
    "REVIEW",
    "ACCEPTED",
    "REJECTED",
    "BLOCKED",
    "CLOSED",
  ],

  KANBAN: [
    "OPEN",
    "REVIEW",
    "IN_PROGRESS",
    "CLOSED",
  ],

  MARKETING: [
    "OPEN",
    "CONCEPT",
    "REVIEW",
    "IN_PROGRESS",
    "RUNNING",
    "CLOSED",
  ],

  CRM: [
    "ANALYSIS",
    "PROPOSAL",
    "QUOTED",
    "NEGOTIATION",
    "WON",
    "LOST",
    "CANCELLED",
  ],
};

export const WORKFLOW_TYPES =
  Object.keys(WORKFLOWS);

export const WORKFLOW_STATUSES = [
  ...new Set(
    Object.values(WORKFLOWS).flat()
  ),
];

export const getInitialWorkflowStatus = (
  workflowType = "STANDARD"
) => (
  WORKFLOWS[workflowType] ||
  WORKFLOWS.STANDARD
)[0];

export const isWorkflowStatus = (
  workflowType,
  status
) => (
  WORKFLOWS[workflowType] || []
).includes(status);
