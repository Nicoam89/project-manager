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
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
            path="/objectives"
            element={
              <ProtectedRoute>
                <Objectives />
              </ProtectedRoute>
            }
          />

          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <Activities />
              </ProtectedRoute>
            }
          />
          <Route
          path="/objectives/:id"
          element={
            <ProtectedRoute>
              <ObjectiveDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals/:id"
            element={
              <ProtectedRoute>
                <GoalDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kanban"
            element={
              <ProtectedRoute>
                <Kanban />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activities/:id"
            element={
              <ProtectedRoute>
      <ActivityDetail />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
    


  );
};

export default AppRouter;