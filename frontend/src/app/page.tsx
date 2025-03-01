import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./auth/login/page";
import Register from "./auth/register/page";
import Dashboard from "./dashboard/page";
import "./globals.css";

function App() {
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        <Route
          path="/auth/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="/cadastro"
          element={
            !isAuthenticated ? (
              <Register />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/auth/login" replace />
          }
        />

        {/* Default route */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/auth/login"} replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
