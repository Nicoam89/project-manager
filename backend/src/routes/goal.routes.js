import { Router } from "express";

import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalDetails,
} from "../controllers/goal.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validation.middleware.js";

import {
  createGoalValidation,
  goalUpdateFields,
  updateGoalValidation,
} from "../validators/goal.validator.js";

import { validateAllowedFields } from "../middleware/allowedFields.middleware.js";



const router = Router();

router.use(protect);

router.route("/")
  .post(
    createGoalValidation,
    validate,
    createGoal
  )
  .get(getGoals);

router.route("/:id")
  .get(getGoalById)
  .put(
    validateAllowedFields(goalUpdateFields),
    updateGoalValidation,
    validate,
    updateGoal
  )
  .delete(deleteGoal);

router.get(
  "/:id/details",
  getGoalDetails
);

export default router;
