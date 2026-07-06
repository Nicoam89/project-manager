import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import PlanningGrid from "../pages/PlanningGrid";
import Agenda from "../pages/Agenda";
import GanttBoard from "../pages/GanttBoard.jsx";
import Timeline from "../pages/Timeline";

import ProtectedRoute from "./ProtectedRoute";

import Objectives from "../pages/Objectives";
import Goals from "../pages/Goals";
import Activities from "../pages/Activities";

import ObjectiveDetail from "../pages/ObjectiveDetail";
import GoalDetail from "../pages/GoalDetail";

import ActivityDetail from "../pages/ActivityDetail";
import ProfileSettings from "../pages/ProfileSettings";
import VerifyEmail from "../pages/VerifyEmail";

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
          path="/"
          element={<Landing />}
        />

        <Route
          path="/landing"
          element={<Navigate to="/" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        <Route
          path="/verify-email/:token"
          element={<VerifyEmail />}
        />

        <Route
          path="/dashboard"
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
          path="/gantt"
          element={protectedPage(<GanttBoard />)}
        />
        
        <Route
          path="/timeline"
          element={protectedPage(<Timeline />)}
        />

         <Route
          path="/agenda"
          element={protectedPage(<Agenda />)}
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
