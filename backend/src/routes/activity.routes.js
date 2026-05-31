import { Router } from "express";

import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getActivityDetails,
  addTimeEntry,
  updateActivityStatus,
} from "../controllers/activity.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validation.middleware.js";

import {
  createActivityValidation,
} from "../validators/activity.validator.js";

import { addTimeValidation } from "../validators/time.validator.js";


const router = Router();

router.use(protect);

router.route("/")
  .post(
    createActivityValidation,
    validate,
    createActivity
  )
  .get(getActivities);

router.route("/:id")
  .get(getActivityById)
  .put(updateActivity)
  .delete(deleteActivity);


  router.get(  "/:id/details",  getActivityDetails);

router.post(  "/:id/time",  addTimeEntry);

router.post(
  "/:id/time",

  addTimeValidation,

  validate,

  addTimeEntry
);

router.patch(
  "/:id/status",
  updateActivityStatus
);

export default router;