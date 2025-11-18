"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import { Routes,Route } from 'react-router-dom'
import { Link } from "react-router-dom";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconFileInvoice,
  IconFilePlus,
  IconSettings,
  IconUserBolt,
  IconUsers,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Clients from "../pages/Clients";
import Invoices from "../pages/Invoices";
import InvoiceForm from "../pages/InvoiceForm";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Logout from "../pages/Logout";
import DashboardPage from "../pages/Dashboard";
import LogoIcon from "../components/logoicon";
import Logo  from "../components/logo";
import Page404 from "../pages/page404";
import Homepage from "../pages/homepage";

/**
 * Main App Component
 * 
 * Structure:
 * - Sidebar navigation with collapsible menu
 * - Main content area with routing
 * 
 * Routes:
 * / - Homepage
 * /dashboard - Dashboard overview
 * /clients - Client management (CRUD)
 * /invoices - Invoice list with filters
 * /invoice-form - Create new invoices
 * /profile - User profile
 * /settings - Application settings
 * /logout - Logout page
 * 
 * Data Flow:
 * Settings → InvoiceForm → Invoices
 * Clients → InvoiceForm → Invoices
 * Profile (independent)
 * 
 * All data stored in sessionStorage for persistence
 */
export default function App() {
  // Navigation links configuration
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Clients",
      href: "/clients",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Invoice List",
      href: "/invoices",
      icon: (
        <IconFileInvoice className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Invoice Form",
      href: "/invoice-form",
      icon: (
        <IconFilePlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        // for your use case, use `h-screen` instead of `h-[60vh]`
        "h-screen",
      )}>
      <Sidebar open={open} setOpen={setOpen} >
        <SidebarBody className="justify-between gap-10 border-r border-neutral-200 p-4 dark:border-neutral-700  bg-white p-4 dark:bg-neutral-900">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <Link to={link.href} key={idx} >
                <SidebarLink key={idx} link={link} />
                  </Link>
              ))}
            </div>
          </div>
          <div>
            <Link to="/profile">
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar" />
                ),
              }} />
            </Link>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}


const Dashboard = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/invoice-form" element={<InvoiceForm />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
    </>
  );
};
