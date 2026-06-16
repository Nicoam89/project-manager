import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  getAgenda,
  getSummary,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get(
  "/summary",
  protect,
  getSummary
);

router.get(
  "/agenda",
  protect,
  getAgenda
);

export default router;
