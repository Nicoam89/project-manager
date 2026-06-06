import { body } from "express-validator";

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
    .isIn([
      "STANDARD",
      "SCRUM",
      "KANBAN",
      "MARKETING",
      "CRM",
    ]),
];

export const updateActivityStatusValidation = [
  body("status")
    .isIn([
      "PENDING",
      "IN_PROGRESS",
      "COMPLETED",
    ])
    .withMessage("Estado inválido"),
];
