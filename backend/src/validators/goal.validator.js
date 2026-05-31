import { body } from "express-validator";

export const createGoalValidation = [
  body("objective")
    .notEmpty()
    .withMessage(
      "El objetivo es obligatorio"
    ),

  body("title")
    .trim()
    .notEmpty()
    .withMessage(
      "El título es obligatorio"
    ),

  body("type")
    .isIn([
      "BOOLEAN",
      "MONETARY",
      "HOURS",
      "QUALITATIVE",
      "ACTIVITIES",
    ])
    .withMessage(
      "Tipo inválido"
    ),
];