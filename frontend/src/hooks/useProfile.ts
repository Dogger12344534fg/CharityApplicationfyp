import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from '@/src/services/axiosInstance';

// Types
export interface UserProfile {
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    accountType: string;
    avatar?: {
      url: string;
      publicId: string;
    };
    location?: string;
    totalDonated: number;
    donationsCount: number;
    campaignsSupported: number;
    badge?: 'gold' | 'silver' | 'bronze' | null;
  };
  stats: {
    totalDonated: number;
    donationsCount: number;
    campaignsCount: number;
    impactRank: number;
  };
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// API Functions
const profileApi = {
  getProfile: () => axiosInstance.get('/profile'),
  
  updateProfile: (data: UpdateProfileData) =>
    axiosInstance.put('/profile', data),
  
  changePassword: (data: ChangePasswordData) =>
    axiosInstance.post('/profile/change-password', data),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axiosInstance.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteAccount: () => axiosInstance.delete('/profile'),
};

// Hooks
export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await profileApi.getProfile();
      console.log(response.data);
      
      return response.data as { success: boolean; data: UserProfile };
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: profileApi.changePassword,
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: profileApi.deleteAccount,
  });
};
