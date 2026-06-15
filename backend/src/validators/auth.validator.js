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
body("age")
    .optional({
      checkFalsy: true,
      nullable: true,
    })
    .isInt({
      min: 13,
      max: 120,
    })
    .withMessage(
      "La edad debe estar entre 13 y 120 años"
    )
    .toInt(),

  body("sex")
    .optional({
      checkFalsy: true,
    })
    .isIn([
      "femenino",
      "masculino",
      "no-binario",
      "prefiero-no-decir",
      "otro",
    ])
    .withMessage(
      "Selecciona una opción de sexo válida"
    ),

  body("profession")
    .optional({
      checkFalsy: true,
    })
    .trim()
    .isLength({ max: 80 })
    .withMessage(
      "La profesión no puede superar 80 caracteres"
    ),
];
