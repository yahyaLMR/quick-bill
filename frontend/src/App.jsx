"use client";

import React from "react";
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Clients from "../pages/Clients";
import Invoices from "../pages/Invoices";
import InvoiceForm from "../pages/InvoiceForm";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import DashboardPage from "../pages/Dashboard";
import Page404 from "../pages/page404";
import LandingPage from "../pages/LandingPage";
import Features from "../pages/Features";
import Pricing from "../pages/Pricing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import VerificationSent from "../pages/VerificationSent";
import DashboardLayout from "../layouts/DashboardLayout";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Main App Component
 * 
 * Structure:
 * - Public routes (Landing, Login, Register) without sidebar
 * - Protected/Dashboard routes with sidebar
 */
export default function App() {
  return (
    <>
      <Toaster position="top-center " />
      <Routes>
        {/* Public Routes (With Navbar) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verification-sent" element={<VerificationSent />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          {/* Global 404 */}
          <Route path="*" element={<Page404 />} />
        </Route>

      {/* Dashboard Routes (With Sidebar) - Protected */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoice-form" element={<InvoiceForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      </Routes>
    </>
  );
}
