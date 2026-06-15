import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(
      "El nombre es obligatorio"
    )
    .isLength({ min: 2 })
    .withMessage(
      "El nombre debe tener al menos 2 caracteres"
    ),

  body("email")
    .isEmail()
    .withMessage(
      "Email inválido"
    ),

  body("password")
    .isLength({ min: 6 })
    .withMessage(
      "La contraseña debe tener mínimo 6 caracteres"
    ),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage(
      "Email inválido"
    ),

  body("password")
    .notEmpty()
    .withMessage(
      "La contraseña es obligatoria"
    ),
];

export const updateProfileValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(
      "El nombre es obligatorio"
    )
    .isLength({ min: 2 })
    .withMessage(
      "El nombre debe tener al menos 2 caracteres"
    ),

  body("email")
    .isEmail()
    .withMessage(
      "Email inválido"
    ),
];
