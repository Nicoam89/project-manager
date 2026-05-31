import { Router } from "express";

import {
  register,
  login,
  getMe,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validation.middleware.js";

import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator.js";

const router = Router();

router.post(
  "/register",
  registerValidation,
  validate,
  register
);

router.post(
  "/login",
  loginValidation,
  validate,
  login
);

router.get(
  "/me",
  protect,
  getMe
);

export default router;