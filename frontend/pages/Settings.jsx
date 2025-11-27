import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/lib/api';
import {
  IconSettings,
  IconBuilding,
  IconPhoto,
  IconPercentage,
  IconCoin,
  IconHash,
  IconBriefcase,
  IconUpload,
  IconEdit,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

/**
 * Settings Component
 * 
 * Purpose: Configure application-wide settings for invoicing
 * Storage: SessionStorage (key: 'appSettings')
 * Used by: InvoiceForm, Invoices (preview/display), Profile
 * 
 * Configuration Sections:
 * 1. Company Information - Name, address, ICE, logo (appears on invoices)
 * 2. VAT Configuration - Enable/disable, global rate
 * 3. Currency - Symbol used throughout the application
 * 4. Invoice Numbering - Prefix, zero padding, yearly reset
 * 5. Business Type - Services/Commerce with monthly caps
 * 
 * Data Structure:
 * {
 *   companyName, companyAddress, companyICE, logoDataUrl,
 *   vatEnabled, vatRate (decimal 0-1),
 *   currency, numberingPrefix, zeroPadding, resetNumberYearly,
 *   businessType, monthlyCap
 * }
 */
const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load settings from backend
  const [settings, setSettings] = useState({
    companyName: '',
    companyAddress: '',
    companyICE: '',
    logoDataUrl: '',
    vatEnabled: true,
    vatRate: 0.2,
    currency: 'DH',
    numberingPrefix: 'INV',
    zeroPadding: 4,
    resetNumberYearly: true,
    businessType: 'services',
    monthlyCap: 200000,
  });

  const [editSettings, setEditSettings] = useState(settings);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings(response.data);
        setEditSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        localStorage.removeItem("token");
        navigate('/login');
      }
    };
    fetchSettings();
  }, []);

  const handleEdit = () => {
    setEditSettings(settings);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditSettings(settings);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/settings', editSettings);
      setSettings(response.data);
      setIsEditing(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleChange = (updates) => {
    setEditSettings((prev) => ({ ...prev, ...updates }));
  };

  // Handle logo file input -> base64 URL stored in settings
  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleChange({ logoDataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  // Build a sample invoice number from numbering options
  const sampleNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const currentSettings = isEditing ? editSettings : settings;
    const padded = String(1).padStart(currentSettings.zeroPadding || 4, '0');
    return `${currentSettings.numberingPrefix || 'INV'}-${year}-${padded}`;
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-lg px-6 py-4 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <IconSettings className="h-8 w-8 text-neutral-700 dark:text-neutral-200" />
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                  Settings
                </h1>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Configure your company information and invoice preferences
              </p>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <IconEdit className="h-5 w-5" />
                Edit Settings
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
          {showSuccessMessage && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium">
                ✓ Settings saved successfully!
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Company Information */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <IconBuilding className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                Company Information
              </h2>
            </div>

            <div className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Company Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editSettings.companyName}
                    onChange={(e) => handleChange({ companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2">
                    {settings.companyName}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={editSettings.companyAddress}
                    onChange={(e) => handleChange({ companyAddress: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2 whitespace-pre-wrap">
                    {settings.companyAddress}
                  </p>
                )}
              </div>

              {/* ICE */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  ICE Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editSettings.companyICE}
                    onChange={(e) => handleChange({ companyICE: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2">
                    {settings.companyICE}
                  </p>
                )}
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Company Logo
                </label>
                {isEditing ? (
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                    >
                      <IconUpload className="h-5 w-5" />
                      Upload Logo
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    {editSettings.logoDataUrl && (
                      <div className="flex items-center gap-2">
                        <img
                          src={editSettings.logoDataUrl}
                          alt="Company Logo"
                          className="h-12 w-12 object-contain border border-neutral-300 dark:border-neutral-600 rounded"
                        />
                        <button
                          onClick={() => handleChange({ logoDataUrl: '' })}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-2">
                    {settings.logoDataUrl ? (
                      <img
                        src={settings.logoDataUrl}
                        alt="Company Logo"
                        className="h-12 w-12 object-contain border border-neutral-300 dark:border-neutral-600 rounded"
                      />
                    ) : (
                      <p className="text-neutral-500 dark:text-neutral-400 italic">
                        No logo uploaded
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* VAT Configuration */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <IconPercentage className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                VAT Configuration
              </h2>
            </div>

            <div className="space-y-4">
              {/* Enable VAT */}
              <div className="flex items-center">
                {isEditing ? (
                  <>
                    <input
                      type="checkbox"
                      id="vatEnabled"
                      checked={editSettings.vatEnabled}
                      onChange={(e) => handleChange({ vatEnabled: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
                    />
                    <label
                      htmlFor="vatEnabled"
                      className="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Enable VAT
                    </label>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.vatEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p className="text-neutral-900 dark:text-neutral-100">
                      {settings.vatEnabled ? 'VAT Enabled' : 'VAT Disabled'}
                    </p>
                  </div>
                )}
              </div>

              {/* VAT Rate */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  VAT Rate (%)
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={((editSettings.vatRate ?? 0) * 100).toString()}
                      onChange={(e) => {
                        const percent = parseFloat(e.target.value);
                        const rate = isNaN(percent) ? 0 : Math.max(0, Math.min(100, percent)) / 100;
                        handleChange({ vatRate: rate });
                      }}
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      This rate will be applied globally to all invoices
                    </p>
                  </>
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2">
                    {((settings.vatRate ?? 0) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Currency & Numbering */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <IconCoin className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                Currency
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Currency Symbol
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editSettings.currency}
                  onChange={(e) => handleChange({ currency: e.target.value })}
                  placeholder="DH, $, €, etc."
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2">
                  {settings.currency}
                </p>
              )}
            </div>
          </div>

          {/* Invoice Numbering */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <IconHash className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                Invoice Numbering
              </h2>
            </div>

            <div className="space-y-4">
              {/* Prefix */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Prefix
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editSettings.numberingPrefix}
                    onChange={(e) => handleChange({ numberingPrefix: e.target.value })}
                    placeholder="INV, FAC, etc."
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2">
                    {settings.numberingPrefix}
                  </p>
                )}
              </div>

              {/* Zero Padding */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Number Length (zero padding)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={(editSettings.zeroPadding ?? 4).toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      const padding = isNaN(value) ? 1 : Math.max(1, Math.min(8, value));
                      handleChange({ zeroPadding: padding });
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2">
                    {settings.zeroPadding} digits
                  </p>
                )}
              </div>

              {/* Reset Yearly */}
              <div className="flex items-center">
                {isEditing ? (
                  <>
                    <input
                      type="checkbox"
                      id="resetYearly"
                      checked={editSettings.resetNumberYearly}
                      onChange={(e) => handleChange({ resetNumberYearly: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
                    />
                    <label
                      htmlFor="resetYearly"
                      className="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Reset numbering yearly
                    </label>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.resetNumberYearly ? 'bg-green-500' : 'bg-neutral-400'}`} />
                    <p className="text-neutral-900 dark:text-neutral-100">
                      {settings.resetNumberYearly ? 'Resets Yearly' : 'Continuous Numbering'}
                    </p>
                  </div>
                )}
              </div>

              {/* Sample Preview */}
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Sample Invoice Number:
                </div>
                <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {sampleNumber()}
                </div>
              </div>
            </div>
          </div>

          {/* Business Type & Caps */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <IconBriefcase className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                Business Type & Limits
              </h2>
            </div>

            <div className="space-y-4">
              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Business Type
                </label>
                {isEditing ? (
                  <select
                    value={editSettings.businessType}
                    onChange={(e) => handleChange({ businessType: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="services">Services (200k cap)</option>
                    <option value="commerce">Commerce (500k cap)</option>
                  </select>
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2 capitalize">
                    {settings.businessType}
                  </p>
                )}
              </div>

              {/* Monthly Cap */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Monthly Cap ({isEditing ? editSettings.currency : settings.currency})
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={(editSettings.monthlyCap ?? 0).toString()}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      const cap = isNaN(value) ? 0 : Math.max(0, value);
                      handleChange({ monthlyCap: cap });
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-neutral-900 dark:text-neutral-100 px-4 py-2">
                    {settings.monthlyCap?.toLocaleString()} {settings.currency}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
