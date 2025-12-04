import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from "../src/lib/api";
import { useTheme } from '../src/context/ThemeContext';
import {
  IconArrowLeft,
  IconBrandTabler,
  IconFileInvoice,
  IconFilePlus,
  IconSettings,
  IconUserBolt,
  IconUsers,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import LogoIcon from "../components/logoicon";
import Logo from "../components/logo";

export default function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
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
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ name: "User", avatar: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/profile");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchUser();
  }, []);

  // Handle user logout
  const handlelogout = (e) => {
    if (e) e.preventDefault();
    // Clear user session or token
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    // Redirect to login page
    navigate("/login");
  }
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen",
      )}>
      {/* Sidebar Component */}
      <Sidebar open={open} setOpen={setOpen} >
        <SidebarBody className="justify-between gap-10 border-r border-neutral-200  dark:border-neutral-700  bg-white p-4 dark:bg-neutral-900">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {/* Render Sidebar Links */}
              {links.map((link, idx) => (
                <Link onClick={link.label === "Logout" ? handlelogout : undefined} to={link.href} key={idx} >
                  <SidebarLink
                    key={idx}
                    link={link}
                    className={location.pathname === link.href ? "bg-neutral-200 dark:bg-neutral-700 rounded-md px-2" : ""}
                  />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div onClick={toggleTheme} className="cursor-pointer mb-2">
               <SidebarLink 
                 link={{
                   label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
                   href: "#",
                   icon: theme === 'dark' ? <IconSun className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> : <IconMoon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                 }}
               />
             </div>
            <Link to="/profile">
              <SidebarLink
                link={{
                  label: user.name || "User",
                  href: "#",
                  icon: (
                    <img
                      src={user.avatar || "data:image/jpeg;base64,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"}
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
      {/* Main Content Area */}
      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
            <Outlet />
        </div>
      </div>
    </div>
  );
}
