import { body } from "express-validator";

const goalTypes = [
  "BOOLEAN",
  "MONETARY",
  "HOURS",
  "QUALITATIVE",
  "ACTIVITIES",
];

const goalStatuses = [
  "ACTIVE",
  "COMPLETED",
  "ARCHIVED",
];

export const goalUpdateFields = [
  "objective",
  "title",
  "description",
  "type",
  "targetValue",
  "currentValue",
  "progress",
  "status",
];

export const createGoalValidation = [
  body("objective")
    .notEmpty()
    .withMessage(
      "El objetivo es obligatorio"
    )
    .isMongoId()
    .withMessage(
      "El objetivo debe ser válido"
    ),

  body("title")
    .trim()
    .notEmpty()
    .withMessage(
      "El título es obligatorio"
    ),

  body("type")
    .isIn(goalTypes)
    .withMessage(
      "Tipo inválido"
    ),

  body("targetValue")
    .notEmpty()
    .withMessage(
      "El valor objetivo es obligatorio"
    ),
];

export const updateGoalValidation = [
  body("objective")
    .optional()
    .isMongoId()
    .withMessage(
      "El objetivo debe ser válido"
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

  body("type")
    .optional()
    .isIn(goalTypes)
    .withMessage(
      "Tipo inválido"
    ),

  body("progress")
    .optional()
    .isInt({
      min: 0,
      max: 100,
    })
    .withMessage(
      "El progreso debe estar entre 0 y 100"
    ),

  body("status")
    .optional()
    .isIn(goalStatuses)
    .withMessage("Estado inválido"),
];
