import { Router } from "express";

import * as activityController from "../controllers/activity.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validation.middleware.js";

import {
  activityUpdateFields,
  createActivityValidation,
  updateActivityValidation,
  updateActivityStatusValidation,
} from "../validators/activity.validator.js";

import { validateAllowedFields } from "../middleware/allowedFields.middleware.js";

import { addTimeValidation } from "../validators/time.validator.js";


const router = Router();

router.use(protect);

router.route("/")
  .post(
    createActivityValidation,
    validate,
    activityController.createActivity
  )
  .get(activityController.getActivities);

router.route("/:id")
  .get(activityController.getActivityById)
  .put(
    validateAllowedFields(activityUpdateFields),
    updateActivityValidation,
    validate,
    activityController.updateActivity
  )

router.get(
  "/:id/details",
  activityController.getActivityDetails
);

router.post(
  "/:id/time",
  addTimeValidation,
  validate,
  activityController.addTimeEntry
);

router.patch(
  "/:id/status",
  updateActivityStatusValidation,
  validate,
  activityController.updateActivityStatus
);
export default router;
