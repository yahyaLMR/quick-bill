import React, { useState, useEffect } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [stats, setStats] = useState({ invoices: 0, clients: 0 });

  const [editData, setEditData] = useState(profileData);

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
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await api.put("/users/profile", editData);
      setProfileData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

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
                    src={isEditing ? editData.avatar : profileData.avatar}
                    alt="Profile"
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
