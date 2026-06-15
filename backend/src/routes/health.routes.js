import { Router } from "express";
import { getDatabaseState } from "../config/db.js";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date(),
    database: getDatabaseState(),
  });
});

export default router;
