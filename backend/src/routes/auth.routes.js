import { Router } from "express";

import {
  register,
  login,
  getMe,
  updateProfile,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validation.middleware.js";

import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
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

router.put(
  "/profile",
  protect,
  updateProfileValidation,
  validate,
  updateProfile
);

export default router;
