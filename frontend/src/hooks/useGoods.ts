import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/src/services/axiosInstance';

// Types
export interface GoodsDonation {
  _id: string;
  campaign: {
    _id: string;
    title: string;
    status: string;
    goalAmount: number;
    raisedAmount: number;
    images?: {
      url: string;
      publicId: string;
    };
    location: string;
  };
  donor: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: GoodsItem[];
  pickupLocation: {
    _id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    coordinates: [number, number];
  };
  deliveryMethod: 'pickup' | 'drop-off' | 'courier';
  preferredPickupTime?: string;
  contactInfo: {
    phone: string;
    alternatePhone?: string;
    email?: string;
    preferredContactMethod: 'phone' | 'email' | 'both';
  };
  status: 'pending' | 'verified' | 'scheduled' | 'collected' | 'delivered' | 'completed' | 'cancelled' | 'rejected';
  verifiedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  verifiedAt?: string;
  rejectionReason?: string;
  scheduledPickupDate?: string;
  actualPickupDate?: string;
  deliveryDate?: string;
  courierInfo?: {
    name: string;
    phone: string;
    trackingNumber?: string;
  };
  donorNotes?: string;
  adminNotes?: string;
  totalEstimatedValue: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface GoodsItem {
  _id: string;
  name: string;
  category: 'food' | 'clothing' | 'medical' | 'shelter' | 'education' | 'electronics' | 'household' | 'other';
  quantity: number;
  unit: 'pieces' | 'kg' | 'liters' | 'boxes' | 'bags' | 'sets' | 'units';
  estimatedValue: number;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  description?: string;
  images: {
    url: string;
    publicId: string;
  }[];
}

export interface GoodsDonationStats {
  statusStats: {
    _id: string;
    count: number;
    totalValue: number;
    totalItems: number;
  }[];
  categoryStats: {
    _id: string;
    count: number;
    totalValue: number;
    totalQuantity: number;
  }[];
}

export interface GoodsDonationsResponse {
  donations: GoodsDonation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Query parameters
export interface GoodsDonationFilters {
  page?: number;
  limit?: number;
  status?: string;
  campaign?: string;
  city?: string;
  category?: string;
  deliveryMethod?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// API Functions
const goodsApi = {
  // Admin endpoints
  getAllDonations: (filters: GoodsDonationFilters = {}) =>
    axiosInstance.get('/goods/admin/all', { params: filters }),
  
  getStats: () =>
    axiosInstance.get('/goods/admin/stats'),
  
  getDonationById: (id: string) =>
    axiosInstance.get(`/goods/${id}`),
  
  verifyDonation: (id: string) =>
    axiosInstance.patch(`/goods/${id}/verify`),
  
  rejectDonation: (id: string, rejectionReason: string) =>
    axiosInstance.patch(`/goods/${id}/reject`, { rejectionReason }),
  
  schedulePickup: (id: string, data: { scheduledPickupDate: string; courierInfo?: any }) =>
    axiosInstance.patch(`/goods/${id}/schedule`, data),
  
  markAsCollected: (id: string, actualPickupDate?: string) =>
    axiosInstance.patch(`/goods/${id}/collect`, { actualPickupDate }),
  
  markAsDelivered: (id: string, deliveryDate?: string) =>
    axiosInstance.patch(`/goods/${id}/deliver`, { deliveryDate }),
  
  markAsCompleted: (id: string) =>
    axiosInstance.patch(`/goods/${id}/complete`),
  
  updateAdminNotes: (id: string, adminNotes: string) =>
    axiosInstance.put(`/goods/${id}`, { adminNotes }),
  
  deleteDonation: (id: string) =>
    axiosInstance.delete(`/goods/${id}`),
};

// Hooks
export const useGetAllGoodsDonations = (filters: GoodsDonationFilters = {}) => {
  return useQuery({
    queryKey: ['goods-donations', 'admin', filters],
    queryFn: async () => {
      const response = await goodsApi.getAllDonations(filters);
      return response.data as { success: boolean } & GoodsDonationsResponse;
    },
  });
};

export const useGetGoodsDonationStats = () => {
  return useQuery({
    queryKey: ['goods-donations', 'stats'],
    queryFn: async () => {
      const response = await goodsApi.getStats();
      return response.data as { success: boolean; data: GoodsDonationStats };
    },
  });
};

export const useGetGoodsDonationById = (id: string) => {
  return useQuery({
    queryKey: ['goods-donations', id],
    queryFn: async () => {
      const response = await goodsApi.getDonationById(id);
      return response.data as { success: boolean; data: GoodsDonation };
    },
    enabled: !!id,
  });
};

export const useVerifyGoodsDonation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: goodsApi.verifyDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goods-donations'] });
    },
  });
};

export const useRejectGoodsDonation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
      goodsApi.rejectDonation(id, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goods-donations'] });
    },
  });
};

export const useSchedulePickup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { scheduledPickupDate: string; courierInfo?: any } }) =>
      goodsApi.schedulePickup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goods-donations'] });
    },
  });
};

export const useMarkAsCollected = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, actualPickupDate }: { id: string; actualPickupDate?: string }) =>
      goodsApi.markAsCollected(id, actualPickupDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goods-donations'] });
    },
  });
};

export const useMarkAsDelivered = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, deliveryDate }: { id: string; deliveryDate?: string }) =>
      goodsApi.markAsDelivered(id, deliveryDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goods-donations'] });
    },
  });
};

export const useMarkAsCompleted = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: goodsApi.markAsCompleted,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goods-donations'] });
    },
  });
};

export const useUpdateAdminNotes = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, adminNotes }: { id: string; adminNotes: string }) =>
      goodsApi.updateAdminNotes(id, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goods-donations'] });
    },
  });
};

export const useDeleteGoodsDonation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: goodsApi.deleteDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goods-donations'] });
    },
  });
};