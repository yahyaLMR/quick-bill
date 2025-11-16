import React, { useState, useRef} from 'react';
import {
  IconSettings,
  IconBuilding,
  IconPhoto,
  IconPercentage,
  IconCoin,
  IconHash,
  IconBriefcase,
  IconUpload,
} from '@tabler/icons-react';

const Settings = () => {
  const fileInputRef = useRef(null);

  // Load settings from sessionStorage
  const [settings, setSettings] = useState(() => {
    const saved = sessionStorage.getItem('appSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      companyName: 'Quick Bill Inc.',
      companyAddress: '123 Business Ave\nCity, Country',
      companyICE: 'ICE123456789',
      logoDataUrl: '',
      vatEnabled: true,
      vatRate: 0.2, // 20%
      vatMode: 'global', // 'global' or 'per-item'
      currency: 'DH',
      numberingPrefix: 'INV',
      zeroPadding: 4,
      resetNumberYearly: true,
      businessType: 'services', // 'services' or 'commerce'
      monthlyCap: 200000,
    };
  });

  const [originalSettings, setOriginalSettings] = useState(settings);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check if there are unsaved changes
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const handleChange = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    sessionStorage.setItem('appSettings', JSON.stringify(settings));
    setOriginalSettings(settings);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
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
    const padded = String(1).padStart(settings.zeroPadding || 4, '0');
    return `${settings.numberingPrefix || 'INV'}-${year}-${padded}`;
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
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
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                hasChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
              }`}
            >
              Update Settings
            </button>
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
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => handleChange({ companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Address
                </label>
                <textarea
                  value={settings.companyAddress}
                  onChange={(e) => handleChange({ companyAddress: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ICE */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  ICE Number
                </label>
                <input
                  type="text"
                  value={settings.companyICE}
                  onChange={(e) => handleChange({ companyICE: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Company Logo
                </label>
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
                  {settings.logoDataUrl && (
                    <div className="flex items-center gap-2">
                      <img
                        src={settings.logoDataUrl}
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
                <input
                  type="checkbox"
                  id="vatEnabled"
                  checked={settings.vatEnabled}
                  onChange={(e) => handleChange({ vatEnabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor="vatEnabled"
                  className="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Enable VAT
                </label>
              </div>

              {/* VAT Rate */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  VAT Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={((settings.vatRate ?? 0) * 100).toString()}
                  onChange={(e) => {
                    const percent = parseFloat(e.target.value);
                    const rate = isNaN(percent) ? 0 : Math.max(0, Math.min(100, percent)) / 100;
                    handleChange({ vatRate: rate });
                  }}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* VAT Mode */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  VAT Mode
                </label>
                <select
                  value={settings.vatMode}
                  onChange={(e) => handleChange({ vatMode: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="global">Global (single rate)</option>
                  <option value="per-item">Per Item (VAT per line)</option>
                </select>
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
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => handleChange({ currency: e.target.value })}
                placeholder="DH, $, €, etc."
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                <input
                  type="text"
                  value={settings.numberingPrefix}
                  onChange={(e) => handleChange({ numberingPrefix: e.target.value })}
                  placeholder="INV, FAC, etc."
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Zero Padding */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Number Length (zero padding)
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={settings.zeroPadding}
                  onChange={(e) =>
                    handleChange({ zeroPadding: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Reset Yearly */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="resetYearly"
                  checked={settings.resetNumberYearly}
                  onChange={(e) => handleChange({ resetNumberYearly: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor="resetYearly"
                  className="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Reset numbering yearly
                </label>
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
                <select
                  value={settings.businessType}
                  onChange={(e) => handleChange({ businessType: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="services">Services (200k cap)</option>
                  <option value="commerce">Commerce (500k cap)</option>
                </select>
              </div>

              {/* Monthly Cap */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Monthly Cap ({settings.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.monthlyCap}
                  onChange={(e) =>
                    handleChange({ monthlyCap: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
