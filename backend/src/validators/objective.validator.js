import { body } from "express-validator";

const objectiveStatuses = [
  "ACTIVE",
  "COMPLETED",
  "ARCHIVED",
];

export const objectiveUpdateFields = [
  "title",
  "description",
  "status",
  "progress",
];

export const createObjectiveValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(
      "El título es obligatorio"
    )
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage(
      "El título debe tener entre 3 y 200 caracteres"
    ),

  body("description")
    .optional()
    .isString()
    .withMessage(
      "La descripción debe ser texto"
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
];

export const updateObjectiveValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "El título no puede estar vacío"
    )
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage(
      "El título debe tener entre 3 y 200 caracteres"
    ),

  body("description")
    .optional()
    .isString()
    .withMessage(
      "La descripción debe ser texto"
    ),

  body("status")
    .optional()
    .isIn(objectiveStatuses)
    .withMessage("Estado inválido"),

  body("progress")
    .optional()
    .isInt({
      min: 0,
      max: 100,
    })
    .withMessage(
      "El progreso debe estar entre 0 y 100"
    ),
];
