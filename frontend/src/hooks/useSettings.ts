import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/src/services/axiosInstance';

// Types
export interface UserSettings {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    accountType: string;
  };
  organization: {
    name: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    description: string;
    logo?: {
      url: string;
      publicId: string;
    };
  };
  notifications: {
    emailNotifications: boolean;
    smsAlerts: boolean;
    newCampaigns: boolean;
    donationAlerts: boolean;
    systemUpdates: boolean;
    weeklyDigest: boolean;
    monthlyReport: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordChangeRequired: boolean;
    lastPasswordChange?: string;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: 'en' | 'ne';
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    currency: 'NPR' | 'USD';
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'donors-only';
    showDonationHistory: boolean;
    showEmail: boolean;
    showPhone: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  description?: string;
}

export interface NotificationSettings {
  emailNotifications?: boolean;
  smsAlerts?: boolean;
  newCampaigns?: boolean;
  donationAlerts?: boolean;
  systemUpdates?: boolean;
  weeklyDigest?: boolean;
  monthlyReport?: boolean;
}

export interface SecuritySettings {
  twoFactorAuth?: boolean;
  sessionTimeout?: number;
  passwordChangeRequired?: boolean;
}

export interface DisplaySettings {
  theme?: 'light' | 'dark' | 'auto';
  language?: 'en' | 'ne';
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  currency?: 'NPR' | 'USD';
}

export interface PrivacySettings {
  profileVisibility?: 'public' | 'private' | 'donors-only';
  showDonationHistory?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// API Functions
const settingsApi = {
  getSettings: () => axiosInstance.get('/settings'),
  
  updateOrganization: (data: OrganizationSettings) =>
    axiosInstance.put('/settings/organization', data),
  
  updateNotifications: (data: NotificationSettings) =>
    axiosInstance.put('/settings/notifications', data),
  
  updateSecurity: (data: SecuritySettings) =>
    axiosInstance.put('/settings/security', data),
  
  updateDisplay: (data: DisplaySettings) =>
    axiosInstance.put('/settings/display', data),
  
  updatePrivacy: (data: PrivacySettings) =>
    axiosInstance.put('/settings/privacy', data),
  
  changePassword: (data: ChangePasswordData) =>
    axiosInstance.post('/settings/change-password', data),
  
  deleteAccount: () =>
    axiosInstance.delete('/settings/account'),
};

// Hooks
export const useGetSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsApi.getSettings();
      return response.data as { success: boolean; data: UserSettings };
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.updateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.updateNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useUpdateSecurity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.updateSecurity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useUpdateDisplay = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.updateDisplay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useUpdatePrivacy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.updatePrivacy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: settingsApi.changePassword,
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: settingsApi.deleteAccount,
  });
};
