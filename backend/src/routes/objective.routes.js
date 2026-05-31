import { Router } from "express";

import {
  createObjective,
  getObjectives,
  getObjectiveById,
  getObjectiveDetails,
  updateObjective,
  deleteObjective,
} from "../controllers/objective.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validation.middleware.js";

import {
  createObjectiveValidation,
} from "../validators/objective.validator.js";

router.get( "/:id/details", getObjectiveDetails);


const router = Router();

router.use(protect);

router.route("/")
  .post(
    createObjectiveValidation,
    validate,
    createObjective
  )
  .get(getObjectives);

router.route("/:id")
  .get(getObjectiveById)
  .put(updateObjective)
  .delete(deleteObjective);

export default router;