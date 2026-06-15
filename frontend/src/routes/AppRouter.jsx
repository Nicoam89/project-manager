import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import PlanningGrid from "../pages/PlanningGrid";

import ProtectedRoute from "./ProtectedRoute";

import Objectives from "../pages/Objectives";
import Goals from "../pages/Goals";
import Activities from "../pages/Activities";

import ObjectiveDetail from "../pages/ObjectiveDetail";
import GoalDetail from "../pages/GoalDetail";

import ActivityDetail from "../pages/ActivityDetail";
import ProfileSettings from "../pages/ProfileSettings";

const protectedPage = (children) => (
  <ProtectedRoute>
    {children}
  </ProtectedRoute>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={protectedPage(<Dashboard />)}
        />

        <Route
          path="/objectives"
          element={protectedPage(<Objectives />)}
        />

        <Route
          path="/objectives/:id"
          element={protectedPage(<ObjectiveDetail />)}
        />

        <Route
          path="/goals"
          element={protectedPage(<Goals />)}
        />

        <Route
          path="/goals/:id"
          element={protectedPage(<GoalDetail />)}
        />

        <Route
          path="/activities"
          element={protectedPage(<Activities />)}
        />

        <Route
          path="/planning-grid"
          element={protectedPage(<PlanningGrid />)}
        />

        <Route
          path="/activities/:id"
          element={protectedPage(<ActivityDetail />)}
        />

        <Route
          path="/kanban"
          element={protectedPage(<Navigate to="/goals" replace />)}
        />

                <Route
          path="/settings"
          element={protectedPage(<ProfileSettings />)}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
