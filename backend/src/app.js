import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import objectiveRoutes from "./routes/objective.routes.js";
import {
  notFound,
  errorHandler,
} from "./middleware/error.middleware.js";
import goalRoutes from "./routes/goal.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { requireDatabaseConnection } from "./middleware/database.middleware.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRoutes);

app.use(requireDatabaseConnection);

app.use("/api/auth", authRoutes);

app.use("/api/objectives", objectiveRoutes);

app.use("/api/goals", goalRoutes);

app.use("/api/activities", activityRoutes);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(notFound);

app.use(errorHandler);


export default app;
