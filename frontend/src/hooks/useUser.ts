import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "../services/axiosInstance";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive" | "suspended";
  accountType: "individual" | "organization";
  phone: string | null;
  totalDonated: number;
  donationsCount: number;
  campaignsSupported: number;
  createdAt: string;
  updatedAt: string;
  lastDonationMonth: string | null;
  badge: "gold" | "silver" | "bronze" | null;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface UserStatsResponse {
  success: boolean;
  data: {
    totalDonors: number;
    totalDonated: number;
    totalDonations: number;
  };
}

export const useGetAllUsersAdmin = (query?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  accountType?: string;
}) => {
  return useQuery<UsersResponse, Error>({
    queryKey: ["admin-users", query],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/admin/all", { params: query });
      return data;
    },
  });
};

export const useGetDonorStatsAdmin = () => {
  return useQuery<UserStatsResponse, Error>({
    queryKey: ["admin-users-stats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/admin/stats");
      return data;
    },
  });
};

export const useUpdateUserStatusAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await axiosInstance.patch(`/users/admin/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};
export interface UpdateUserProfilePayload {
  name?: string;
  phone?: string;
  accountType?: "individual" | "organization";
  status?: "active" | "inactive" | "suspended";
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserProfilePayload }) => {
      const response = await axiosInstance.put(`/users/admin/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user profile");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/users/admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};