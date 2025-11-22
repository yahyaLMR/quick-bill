"use client";

import React from "react";
import { Routes, Route } from 'react-router-dom';
import Clients from "../pages/Clients";
import Invoices from "../pages/Invoices";
import InvoiceForm from "../pages/InvoiceForm";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Logout from "../pages/Logout";
import DashboardPage from "../pages/Dashboard";
import Page404 from "../pages/page404";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardLayout from "../layouts/DashboardLayout";

/**
 * Main App Component
 * 
 * Structure:
 * - Public routes (Landing, Login, Register) without sidebar
 * - Protected/Dashboard routes with sidebar
 */
export default function App() {
  return (
    <Routes>
      {/* Public Routes (No Sidebar) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Routes (With Sidebar) */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoice-form" element={<InvoiceForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<Logout />} />
      </Route>

      {/* Global 404 */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
