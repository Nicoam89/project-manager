import { body } from "express-validator";

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
    .withMessage("Flujo de trabajo inválido"),

  body("estimatedHours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage(
      "Las horas estimadas deben ser mayores o iguales a 0"
    ),
];

export const updateActivityValidation = [
  body("goal")
    .optional()
    .isMongoId()
    .withMessage(
      "La meta debe ser válida"
    ),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "El título no puede estar vacío"
    ),

  body("description")
    .optional()
    .isString()
    .withMessage(
      "La descripción debe ser texto"
    ),

  body("workflowType")
    .optional()
    .isIn(WORKFLOW_TYPES)
    .withMessage("Flujo de trabajo inválido"),

  body("status")
    .optional()
    .isIn(WORKFLOW_STATUSES)
    .withMessage("Estado inválido"),

  body("priorityType")
    .optional()
    .isIn(priorityTypes)
    .withMessage("Tipo de prioridad inválido"),

  body("priority")
    .optional()
    .isIn(priorities)
    .withMessage("Prioridad inválida"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage(
      "La fecha de inicio debe ser válida"
    ),

  body("dueDate")
    .optional()
    .isISO8601()
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

  body("dependencies")
    .optional()
    .isArray()
    .withMessage(
      "Las dependencias deben ser una lista"
    ),

  body("subtasks")
    .optional()
    .isArray()
    .withMessage(
      "Las subtareas deben ser una lista"
    ),
];

export const updateActivityStatusValidation = [
  body("status")
    .isIn(WORKFLOW_STATUSES)
    .withMessage("Estado inválido"),
];
