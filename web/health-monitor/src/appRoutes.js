import React, { useContext } from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import { Context } from "./context/AuthContext";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard/dashboard";
import LoggedInLayout from "./layout";
import Signup from "./pages/signup"
import ConsultationsWeb from "./pages/consultation";

function LogedRoutes() {
  const { loading, authenticated } = useContext(Context);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<LogedRoutes />}>
        <Route element={<LoggedInLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/consultations" element={<ConsultationsWeb />} />
        </Route>
      </Route>
    </Routes>
  );
}
