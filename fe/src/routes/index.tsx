import { Routes, Route } from "react-router-dom";
import Login from "../views/auth/Login";
import Layout1 from "../views/layout/Layout1";
import Meeting from "../views/meeting/Meeting";
import MeetingAdd from "../views/meeting/MeetingAdd";
import User from "../views/user/User";
import Dashboard from "../views/dashboard/Dashboard";

import AuthLoginRoute from "./routeMiddleware/AuthLoginRoute";
import AuthNotLoginRoute from "./routeMiddleware/AuthNotLogInRoute";
import OnlySuperAdminRoute from "./routeMiddleware/OnlySuperAdminRoute";
import UserAdd from "../views/user/UserAdd";
import UserEdit from "../views/user/UserEdit";
import MeetingEdit from "../views/meeting/MeetingEdit";

export default function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthLoginRoute>
            <Login />
          </AuthLoginRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AuthNotLoginRoute>
            <Dashboard />
          </AuthNotLoginRoute>
        }
      />
      <Route
        path="/meeting"
        element={
          <AuthNotLoginRoute>
            <Layout1>
              <Meeting />
            </Layout1>
          </AuthNotLoginRoute>
        }
      />
      <Route
        path="/meeting_add"
        element={
          <AuthNotLoginRoute>
            <Layout1>
              <MeetingAdd />
            </Layout1>
          </AuthNotLoginRoute>
        }
      />
      <Route
        path="/meeting_edit/:id"
        element={
          <AuthNotLoginRoute>
            <Layout1>
              <MeetingEdit />
            </Layout1>
          </AuthNotLoginRoute>
        }
      />
      <Route
        path="/user"
        element={
          <AuthNotLoginRoute>
            <OnlySuperAdminRoute>
              <Layout1>
                <User />
              </Layout1>
            </OnlySuperAdminRoute>
          </AuthNotLoginRoute>
        }
      />
      <Route
        path="/user_add"
        element={
          <AuthNotLoginRoute>
            <OnlySuperAdminRoute>
              <Layout1>
                <UserAdd />
              </Layout1>
            </OnlySuperAdminRoute>
          </AuthNotLoginRoute>
        }
      />
      <Route
        path="/user_edit/:id"
        element={
          <AuthNotLoginRoute>
            <OnlySuperAdminRoute>
              <Layout1>
                <UserEdit />
              </Layout1>
            </OnlySuperAdminRoute>
          </AuthNotLoginRoute>
        }
      />
    </Routes>
  );
}
