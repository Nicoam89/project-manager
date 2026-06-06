import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "./ProtectedRoute";

import Objectives from "../pages/Objectives";
import Goals from "../pages/Goals";
import Activities from "../pages/Activities";

import ObjectiveDetail from "../pages/ObjectiveDetail";
import GoalDetail from "../pages/GoalDetail";

import Kanban from "../pages/Kanban";
import ActivityDetail from "../pages/ActivityDetail";

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
          path="/activities/:id"
          element={protectedPage(<ActivityDetail />)}
        />

        <Route
          path="/kanban"
          element={protectedPage(<Kanban />)}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
