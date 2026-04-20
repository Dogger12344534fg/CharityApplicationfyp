import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "../services/axiosInstance";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GoodsCategory =
  | "food" | "clothing" | "medical" | "shelter"
  | "education" | "electronics" | "household" | "other";

export type GoodsUnit = "pieces" | "kg" | "liters" | "boxes" | "bags" | "sets" | "units";
export type GoodsCondition = "new" | "like-new" | "good" | "fair";
export type DeliveryMethod = "pickup" | "drop-off" | "courier";

export type GoodsStatus =
  | "pending" | "verified" | "scheduled" | "collected"
  | "delivered" | "completed" | "cancelled" | "rejected";

export interface GoodsItem {
  name:            string;
  category:        GoodsCategory;
  quantity:        number;
  unit:            GoodsUnit;
  estimatedValue:  number;
  condition:       GoodsCondition;
  description?:    string;
  images?:         { url: string; publicId: string }[];
}

export interface GoodsDonation {
  _id:                  string;
  campaign:             { _id: string; title: string; images?: { url: string }; status: string };
  donor:                { _id: string; name: string; email: string };
  items:                GoodsItem[];
  pickupLocation:       { _id: string; name: string; address: string; city: string; state?: string; coordinates: [number, number] };
  deliveryMethod:       DeliveryMethod;
  preferredPickupTime?: string;
  contactInfo:          { phone: string; alternatePhone?: string; email?: string; preferredContactMethod: string };
  status:               GoodsStatus;
  verifiedBy?:          { _id: string; name: string };
  verifiedAt?:          string;
  rejectionReason?:     string;
  scheduledPickupDate?: string;
  actualPickupDate?:    string;
  deliveryDate?:        string;
  courierInfo?:         { name?: string; phone?: string; trackingNumber?: string };
  donorNotes?:          string;
  adminNotes?:          string;
  totalEstimatedValue:  number;
  totalItems:           number;
  createdAt:            string;
  updatedAt:            string;
}

export interface GoodsDonationListResponse {
  success:    boolean;
  donations:  GoodsDonation[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface GoodsDonationResponse {
  success:  boolean;
  message?: string;
  data:     GoodsDonation;
}

export interface CreateGoodsDonationPayload {
  campaignId:          string;
  items:               GoodsItem[];
  pickupLocation:      { name?: string; address: string; city: string; state?: string; country?: string; coordinates: [number, number] };
  deliveryMethod:      DeliveryMethod;
  preferredPickupTime?: string;
  contactInfo:         { phone: string; alternatePhone?: string; email?: string; preferredContactMethod?: string };
  donorNotes?:         string;
}

// ─── Error resolver ───────────────────────────────────────────────────────────
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

// ═══════════════════════════════════════════════
// QUERY HOOKS
// ═══════════════════════════════════════════════

// ─── Get my goods donations ───────────────────────────────────────────────────
export const useGetMyGoodsDonations = (params?: { page?: number; limit?: number }) => {
  return useQuery<GoodsDonationListResponse, Error>({
    queryKey: ["goods-donations", "mine", params],
    queryFn:  async () => {
      const res = await axiosInstance.get<GoodsDonationListResponse>(
        "/goods/my-donations",
        { params },
      );
      return res.data;
    },
    staleTime: 1000 * 30,
  });
};

// ─── Get goods donations for a campaign (public) ──────────────────────────────
export const useGetCampaignGoodsDonations = (
  campaignId: string,
  params?: { page?: number; limit?: number; status?: string },
) => {
  return useQuery<GoodsDonationListResponse, Error>({
    queryKey: ["goods-donations", "campaign", campaignId, params],
    queryFn:  async () => {
      const res = await axiosInstance.get<GoodsDonationListResponse>(
        `/goods/campaign/${campaignId}`,
        { params },
      );
      return res.data;
    },
    enabled:  !!campaignId,
    staleTime: 1000 * 60,
  });
};

// ─── Get a single goods donation by ID ───────────────────────────────────────
export const useGetGoodsDonationById = (id: string) => {
  return useQuery<GoodsDonationResponse, Error>({
    queryKey: ["goods-donation", id],
    queryFn:  async () => {
      const res = await axiosInstance.get<GoodsDonationResponse>(`/goods/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

// ─── Admin: get all goods donations ──────────────────────────────────────────
export const useGetAllGoodsDonations = (params?: {
  page?:           number;
  limit?:          number;
  status?:         string;
  campaign?:       string;
  deliveryMethod?: string;
  search?:         string;
}) => {
  return useQuery<GoodsDonationListResponse, Error>({
    queryKey: ["goods-donations", "admin", params],
    queryFn:  async () => {
      const res = await axiosInstance.get<GoodsDonationListResponse>(
        "/goods/admin/all",
        { params },
      );
      return res.data;
    },
    staleTime: 1000 * 30,
  });
};

// ═══════════════════════════════════════════════
// MUTATION HOOKS
// ═══════════════════════════════════════════════

// ─── Create goods donation ────────────────────────────────────────────────────
export const useCreateGoodsDonation = () => {
  const queryClient = useQueryClient();

  return useMutation<GoodsDonationResponse, Error, CreateGoodsDonationPayload>({
    mutationFn: async (payload) => {
      // Send as JSON — images are handled separately if needed
      // The backend accepts JSON for items with URL-based images
      const body = {
        campaignId:          payload.campaignId,
        items:               JSON.stringify(payload.items),
        pickupLocation:      JSON.stringify(payload.pickupLocation),
        deliveryMethod:      payload.deliveryMethod,
        contactInfo:         JSON.stringify(payload.contactInfo),
        ...(payload.preferredPickupTime ? { preferredPickupTime: payload.preferredPickupTime } : {}),
        ...(payload.donorNotes         ? { donorNotes: payload.donorNotes }                   : {}),
      };

      // Use FormData so backend multer middleware is happy
      const form = new FormData();
      Object.entries(body).forEach(([k, v]) => form.append(k, v as string));

      const res = await axiosInstance.post<GoodsDonationResponse>("/goods", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Goods donation submitted successfully.");
      queryClient.invalidateQueries({ queryKey: ["goods-donations"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to submit goods donation."));
    },
  });
};

// ─── Delete goods donation ────────────────────────────────────────────────────
export const useDeleteGoodsDonation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/goods/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Donation deleted.");
      queryClient.invalidateQueries({ queryKey: ["goods-donations"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete donation."));
    },
  });
};

// ─── Admin: verify ────────────────────────────────────────────────────────────
export const useVerifyGoodsDonation = () => {
  const queryClient = useQueryClient();
  return useMutation<GoodsDonationResponse, Error, string>({
    mutationFn: async (id) => {
      const res = await axiosInstance.patch<GoodsDonationResponse>(`/goods/${id}/verify`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Donation verified.");
      queryClient.invalidateQueries({ queryKey: ["goods-donations"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to verify.")),
  });
};

// ─── Admin: reject ────────────────────────────────────────────────────────────
export const useRejectGoodsDonation = () => {
  const queryClient = useQueryClient();
  return useMutation<GoodsDonationResponse, Error, { id: string; rejectionReason: string }>({
    mutationFn: async ({ id, rejectionReason }) => {
      const res = await axiosInstance.patch<GoodsDonationResponse>(`/goods/${id}/reject`, { rejectionReason });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Donation rejected.");
      queryClient.invalidateQueries({ queryKey: ["goods-donations"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to reject.")),
  });
};

// ─── Admin: schedule pickup ───────────────────────────────────────────────────
export const useSchedulePickup = () => {
  const queryClient = useQueryClient();
  return useMutation<GoodsDonationResponse, Error, { id: string; scheduledPickupDate: string; courierInfo?: object }>({
    mutationFn: async ({ id, ...body }) => {
      const res = await axiosInstance.patch<GoodsDonationResponse>(`/goods/${id}/schedule`, body);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Pickup scheduled.");
      queryClient.invalidateQueries({ queryKey: ["goods-donations"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to schedule.")),
  });
};

// ─── Admin: mark collected ────────────────────────────────────────────────────
export const useMarkAsCollected = () => {
  const queryClient = useQueryClient();
  return useMutation<GoodsDonationResponse, Error, string>({
    mutationFn: async (id) => {
      const res = await axiosInstance.patch<GoodsDonationResponse>(`/goods/${id}/collect`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Marked as collected.");
      queryClient.invalidateQueries({ queryKey: ["goods-donations"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed.")),
  });
};

// ─── Admin: mark delivered ────────────────────────────────────────────────────
export const useMarkAsDelivered = () => {
  const queryClient = useQueryClient();
  return useMutation<GoodsDonationResponse, Error, string>({
    mutationFn: async (id) => {
      const res = await axiosInstance.patch<GoodsDonationResponse>(`/goods/${id}/deliver`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Marked as delivered.");
      queryClient.invalidateQueries({ queryKey: ["goods-donations"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed.")),
  });
};

// ─── Admin: mark completed ────────────────────────────────────────────────────
export const useMarkAsCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation<GoodsDonationResponse, Error, string>({
    mutationFn: async (id) => {
      const res = await axiosInstance.patch<GoodsDonationResponse>(`/goods/${id}/complete`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Donation completed.");
      queryClient.invalidateQueries({ queryKey: ["goods-donations"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed.")),
  });
};