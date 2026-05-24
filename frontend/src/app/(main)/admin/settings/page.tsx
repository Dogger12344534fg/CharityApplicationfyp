'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, AlertCircle, CheckCircle } from 'lucide-react';
import {
  useGetSettings,
  useUpdateOrganization,
  useChangePassword,
  useDeleteAccount,
  type OrganizationSettings,
  type NotificationSettings,
  type SecuritySettings,
  type DisplaySettings,
  type PrivacySettings,
} from '@/src/hooks/useSettings';

export default function SettingsPage() {
  const { data: settingsData, isLoading, isError } = useGetSettings();
  const updateOrganizationMutation = useUpdateOrganization();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();

  const [generalSettings, setGeneralSettings] = useState<OrganizationSettings>({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsAlerts: true,
    newCampaigns: true,
    donationAlerts: true,
    systemUpdates: false,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordChangeRequired: false,
  });

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showDonationHistory: true,
    showEmail: false,
    showPhone: false,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load settings from API
  useEffect(() => {
    if (settingsData?.data) {
      const settings = settingsData.data;
      
      // Use organization settings if available, otherwise fall back to user profile data
      setGeneralSettings({
        name: settings.organization.name || settings.user.name || '',
        email: settings.organization.email || settings.user.email || '',
        phone: settings.organization.phone || settings.user.phone || '',
        website: settings.organization.website || '',
        address: settings.organization.address || '',
      });
      
      setNotificationSettings(settings.notifications);
      setSecuritySettings({
        twoFactorAuth: settings.security.twoFactorAuth,
        sessionTimeout: settings.security.sessionTimeout,
        passwordChangeRequired: settings.security.passwordChangeRequired,
      });
      setDisplaySettings(settings.display);
      setPrivacySettings(settings.privacy);
    }
  }, [settingsData]);

  const handleGeneralChange = (field: string, value: string) => {
    setGeneralSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveGeneral = () => {
    updateOrganizationMutation.mutate(generalSettings, {
      onSuccess: () => {
        toast.success('General settings saved successfully');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to save settings');
      },
    });
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success('Password changed successfully');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Failed to change password');
        },
      }
    );
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Account deleted successfully');
        // Redirect to login or home page
        window.location.href = '/login';
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to delete account');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-setu-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-setu-900 mb-2">Failed to load settings</h3>
          <p className="text-setu-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

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
                value={generalSettings.name}
                onChange={(e) => handleGeneralChange('name', e.target.value)}
                placeholder={settingsData?.data?.user?.name || "Enter organization name"}
                className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-setu-900 mb-2">Email Address</label>
              <input
                type="email"
                value={generalSettings.email}
                onChange={(e) => handleGeneralChange('email', e.target.value)}
                placeholder={settingsData?.data?.user?.email || "Enter email address"}
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
                placeholder={settingsData?.data?.user?.phone || "Enter phone number"}
                className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-setu-900 mb-2">Website</label>
              <input
                type="text"
                value={generalSettings.website}
                onChange={(e) => handleGeneralChange('website', e.target.value)}
                placeholder="Enter website URL"
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
              placeholder="Enter organization address"
              className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
            />
          </div>
          <div className="flex justify-end pt-4 border-t border-setu-200">
            <button 
              onClick={handleSaveGeneral}
              disabled={updateOrganizationMutation.isPending}
              className="px-6 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateOrganizationMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
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
                disabled={changePasswordMutation.isPending}
                className="w-full px-6 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-red-900 mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <p className="text-sm text-red-800">These actions are irreversible. Please proceed with caution.</p>
          
          {!showDeleteConfirm ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Delete Account
            </button>
          ) : (
            <div className="bg-white border border-red-300 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Are you absolutely sure?</h4>
                  <p className="text-sm text-red-800">
                    This will permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteAccountMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleteAccountMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete My Account'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
