import { body } from "express-validator";

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