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
} from "../validators/goal.validator.js";



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
  .put(updateGoal)
  .delete(deleteGoal);

router.get(  "/:id/details",  getGoalDetails);

export default router;