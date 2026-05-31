import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";

import { getSummary } from "../controllers/dashboard.controller.js";

const router = Router();

router.get(
  "/summary",
  protect,
  getSummary
);

export default router;