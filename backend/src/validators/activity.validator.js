import { body } from "express-validator";

import {
  WORKFLOW_STATUSES,
  WORKFLOW_TYPES,
} from "../utils/workflows.js";

export const createActivityValidation = [
  body("goal")
    .notEmpty()
    .withMessage(
      "La meta es obligatoria"
    ),

  body("title")
    .notEmpty()
    .withMessage(
      "El título es obligatorio"
    ),

  body("workflowType")
    .optional()
    .isIn(WORKFLOW_TYPES),
];

export const updateActivityStatusValidation = [
  body("status")
    .isIn(WORKFLOW_STATUSES)
    .withMessage("Estado inválido"),
];
