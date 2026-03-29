'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: 'Disaster Relief Organization',
    email: 'contact@disasterrelief.org',
    phone: '+977-1-4123456',
    website: 'www.disasterrelief.org',
    address: 'Kathmandu, Nepal',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsAlerts: true,
    newCampaigns: true,
    donationAlerts: true,
    systemUpdates: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordChangeRequired: false,
  });

  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGeneralChange = (field: string, value: string) => {
    setGeneralSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSecurityChange = (field: string, value: any) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDisplayChange = (field: string, value: string) => {
    setDisplaySettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Password changed');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold font-display text-setu-950 mb-2">Settings</h1>
        <p className="text-setu-600">Manage your organization settings and preferences</p>
      </div>

      {/* General Settings */}
      <div className="bg-white border border-setu-200 rounded-xl p-6 card-lift">
        <h2 className="text-2xl font-bold text-setu-950 mb-6">General Settings</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-setu-900 mb-2">Organization Name</label>
              <input
                type="text"
                value={generalSettings.organizationName}
                onChange={(e) => handleGeneralChange('organizationName', e.target.value)}
                className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-setu-900 mb-2">Email Address</label>
              <input
                type="email"
                value={generalSettings.email}
                onChange={(e) => handleGeneralChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-setu-900 mb-2">Phone Number</label>
              <input
                type="tel"
                value={generalSettings.phone}
                onChange={(e) => handleGeneralChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-setu-900 mb-2">Website</label>
              <input
                type="text"
                value={generalSettings.website}
                onChange={(e) => handleGeneralChange('website', e.target.value)}
                className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-setu-900 mb-2">Address</label>
            <input
              type="text"
              value={generalSettings.address}
              onChange={(e) => handleGeneralChange('address', e.target.value)}
              className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
            />
          </div>
          <div className="flex justify-end pt-4 border-t border-setu-200">
            <button className="px-6 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white border border-setu-200 rounded-xl p-6 card-lift">
        <h2 className="text-2xl font-bold text-setu-950 mb-6">Display Settings</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-setu-900 mb-2">Theme</label>
              <select
                value={displaySettings.theme}
                onChange={(e) => handleDisplayChange('theme', e.target.value)}
                className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-setu-900 mb-2">Language</label>
              <select
                value={displaySettings.language}
                onChange={(e) => handleDisplayChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
              >
                <option value="en">English</option>
                <option value="ne">Nepali</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-setu-900 mb-2">Date Format</label>
              <select
                value={displaySettings.dateFormat}
                onChange={(e) => handleDisplayChange('dateFormat', e.target.value)}
                className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-setu-200">
            <button className="px-6 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border border-setu-200 rounded-xl p-6 card-lift">
        <h2 className="text-2xl font-bold text-setu-950 mb-6">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-setu-200">
            <div>
              <p className="font-semibold text-setu-900">Email Notifications</p>
              <p className="text-sm text-setu-600">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-setu-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-setu-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-setu-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-setu-200">
            <div>
              <p className="font-semibold text-setu-900">SMS Alerts</p>
              <p className="text-sm text-setu-600">Receive urgent alerts via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.smsAlerts}
                onChange={(e) => handleNotificationChange('smsAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-setu-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-setu-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-setu-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-setu-200">
            <div>
              <p className="font-semibold text-setu-900">New Campaign Notifications</p>
              <p className="text-sm text-setu-600">Get notified when new campaigns are created</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.newCampaigns}
                onChange={(e) => handleNotificationChange('newCampaigns', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-setu-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-setu-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-setu-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-setu-200">
            <div>
              <p className="font-semibold text-setu-900">Donation Alerts</p>
              <p className="text-sm text-setu-600">Get notified of incoming donations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.donationAlerts}
                onChange={(e) => handleNotificationChange('donationAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-setu-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-setu-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-setu-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-setu-900">System Updates</p>
              <p className="text-sm text-setu-600">Get notified about system updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.systemUpdates}
                onChange={(e) => handleNotificationChange('systemUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-setu-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-setu-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-setu-600"></div>
            </label>
          </div>

          <div className="flex justify-end pt-4 border-t border-setu-200">
            <button className="px-6 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
              Save Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white border border-setu-200 rounded-xl p-6 card-lift">
        <h2 className="text-2xl font-bold text-setu-950 mb-6">Security Settings</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-setu-900 mb-4">Change Password</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-setu-900 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-setu-900 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-setu-900 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                onClick={handleSavePassword}
                className="w-full px-6 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="border-t border-setu-200 pt-6">
            <h3 className="font-semibold text-setu-900 mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-setu-600">Enable two-factor authentication for enhanced security</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorAuth}
                  onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-setu-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-setu-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-setu-600"></div>
              </label>
            </div>
          </div>

          <div className="border-t border-setu-200 pt-6">
            <h3 className="font-semibold text-setu-900 mb-4">Session Settings</h3>
            <div>
              <label className="block text-sm font-semibold text-setu-900 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
              />
              <p className="text-xs text-setu-600 mt-2">Automatically log out after this period of inactivity</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-setu-200">
            <button className="px-6 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
              Save Security Settings
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-red-900 mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <p className="text-sm text-red-800">These actions are irreversible. Please proceed with caution.</p>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
            Delete Organization Account
          </button>
        </div>
      </div>
    </div>
  );
}
