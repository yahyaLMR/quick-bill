import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import { Link, Outlet } from 'react-router-dom';
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
import LogoIcon from "../components/logoicon";
import Logo from "../components/logo";

export default function DashboardLayout() {
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
const handlelogout = () => {
  // Clear user session or token
  localStorage.removeItem("token");
  // Redirect to login page
  window.location.href = "/login";
}
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen",
      )}>
      <Sidebar open={open} setOpen={setOpen} >
        <SidebarBody className="justify-between gap-10 border-r border-neutral-200  dark:border-neutral-700  bg-white p-4 dark:bg-neutral-900">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <Link onClick={link.label === "Logout" ? handlelogout : undefined} to={link.href} key={idx} >
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
      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
            <Outlet />
        </div>
      </div>
    </div>
  );
}
