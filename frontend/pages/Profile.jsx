import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../src/lib/api";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconEdit,
  IconCheck,
  IconX,
  IconCamera,
} from "@tabler/icons-react";

/**
 * Profile Component
 *
 * Purpose: Manage user profile information with edit mode
 * Storage: SessionStorage (key: 'userProfile')
 *
 * Features:
 * - View/Edit mode toggle
 * - Avatar with hover effect
 * - Personal information (name, email, phone, bio)
 * - Company information (name, role, location)
 * - Quick stats display
 *
 * Data Structure:
 * {
 *   name, email, phone, avatar,
 *   stats: { clients, invoices, revenue }
 * }
 */
const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [stats, setStats] = useState({ invoices: 0, clients: 0 });

  const [editData, setEditData] = useState(profileData);

  // Fetch profile data and stats on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, invoicesRes, clientsRes] = await Promise.all([
          api.get("/users/profile"),
          api.get("/invoices"),
          api.get("/clients"),
        ]);
        setProfileData(profileRes.data);
        setEditData(profileRes.data);
        setStats({
          invoices: invoicesRes.data.length,
          clients: clientsRes.data.length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        localStorage.removeItem("token");
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  // Enable edit mode
  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      const response = await api.put("/users/profile", editData);
      setProfileData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconUser className="h-8 w-8 text-neutral-700 dark:text-neutral-200" />
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                Profile
              </h1>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <IconEdit className="h-5 w-5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-500 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                >
                  <IconX className="h-5 w-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <IconCheck className="h-5 w-5" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Quick Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative group">
                  <img
                    src={(isEditing ? editData.avatar : profileData.avatar) || "data:image/jpeg;base64,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"}
                    alt="Profile"
                    loading="lazy"
                    className="w-32 h-32 rounded-full object-cover border-4 border-neutral-200 dark:border-neutral-700"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <IconCamera className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {profileData.name}
                  </h2>
                </div>

                {/* Quick Stats */}
                <div className="w-full mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        {stats.invoices}
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        Invoices
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        {stats.clients}
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        Clients
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Personal Information
              </h3>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <IconUser className="h-4 w-4" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2">
                      {profileData.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <IconMail className="h-4 w-4" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2">
                      {profileData.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <IconPhone className="h-4 w-4" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2">
                      {profileData.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
