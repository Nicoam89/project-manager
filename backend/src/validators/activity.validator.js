import {
  WORKFLOW_STATUSES,
  WORKFLOW_TYPES,
} from "../utils/workflows.js";

import { PRIORITIES } from "../utils/priorities.js";

const priorityTypes = Object.keys(PRIORITIES);
const priorities = [
  ...new Set(Object.values(PRIORITIES).flat()),
];

export const activityUpdateFields = [
  "goal",
  "title",
  "description",
  "workflowType",
  "status",
  "priorityType",
  "priority",
  "startDate",
  "dueDate",
  "completedAt",
  "estimatedHours",
  "linkedActivities",
  "comments",
  "subtasks",
  "dependencies",
];

export const createActivityValidation = [
  body("goal")
    .notEmpty()
    .withMessage(
      "La meta es obligatoria"
    )
    .isMongoId()
    .withMessage(
      "La meta debe ser válida"
    ),

  body("title")
    .trim()
    .notEmpty()
    .withMessage(
      "El título es obligatorio"
    ),

  body("workflowType")
    .optional()
    .isIn(WORKFLOW_TYPES)
    .withMessage(
      "La fecha límite debe ser válida"
    ),

  body("completedAt")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage(
      "La fecha de finalización debe ser válida"
    ),

  body("estimatedHours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage(
      "Las horas estimadas deben ser mayores o iguales a 0"
    ),

  body("linkedActivities")
    .optional()
    .isArray()
    .withMessage(
      "Las actividades vinculadas deben ser una lista"
    ),

  body("comments")
    .optional()
    .isArray()
    .withMessage(
      "Los comentarios deben ser una lista"
    ),

  body("comments.*.text")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "El comentario no puede estar vacío"
    ),

  body("dependencies")
    .optional()
    .isArray()
    .withMessage(
      "Las dependencias deben ser una lista"
    ),

  body("dependencies.*")
    .optional()
    .isMongoId()
    .withMessage(
      "Cada dependencia debe ser una actividad válida"
    ),

  body("subtasks")
    .optional()
    .isArray()
    .withMessage(
      "Las subtareas deben ser una lista"
    ),

  body("subtasks.*.title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "El título de la subtarea no puede estar vacío"
    ),

  body("subtasks.*.completed")
    .optional()
    .isBoolean()
    .withMessage(
      "El estado de la subtarea debe ser verdadero o falso"
    ),
];

export const updateActivityStatusValidation = [
  body("status")
    .isIn(WORKFLOW_STATUSES)
    .withMessage("Estado inválido"),
];

