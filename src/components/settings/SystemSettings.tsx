import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Database, Mail } from 'lucide-react';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Barangay Alabang E-Borrow System',
    maxBorrowDays: 7,
    autoApproval: false,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    maxItemsPerRequest: 5,
    requireApproval: true
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    setSaved(true);
    
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure system preferences and policies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Borrow Days</label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.maxBorrowDays}
                onChange={(e) => setSettings(prev => ({ ...prev, maxBorrowDays: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Items Per Request</label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.maxItemsPerRequest}
                onChange={(e) => setSettings(prev => ({ ...prev, maxItemsPerRequest: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Approval Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Approval Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Require Manual Approval</label>
                <p className="text-xs text-gray-500">All requests need staff approval</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, requireApproval: !prev.requireApproval }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.requireApproval ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.requireApproval ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Auto-Approval</label>
                <p className="text-xs text-gray-500">Automatically approve trusted clients</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, autoApproval: !prev.autoApproval }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoApproval ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoApproval ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                <p className="text-xs text-gray-500">Disable new requests temporarily</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-xs text-gray-500">Send email updates to users</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                <p className="text-xs text-gray-500">Send SMS updates to users</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, smsNotifications: !prev.smsNotifications }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Database className="h-6 w-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Backup:</span>
              <span className="font-medium">Today, 3:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database Status:</span>
              <span className="text-green-600 font-medium">Healthy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Storage Used:</span>
              <span className="font-medium">2.3 GB / 10 GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : saved ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}