import { body } from "express-validator";

export const addTimeValidation = [
  body("description")
    .notEmpty()
    .withMessage(
      "Descripción obligatoria"
    ),

  body("hours")
    .isFloat({
      min: 0.1,
    })
    .withMessage(
      "Horas inválidas"
    ),
];