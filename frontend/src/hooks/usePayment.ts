import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "../services/axiosInstance";
import axios from "axios";

export interface InitiateEsewaPayload {
  campaignId: string;
  amount: number;
  tipAmount?: number;
  anonymous?: boolean;
}

export interface EsewaPayload {
  amount: number;
  tax_amount: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number;
  product_delivery_charge: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export interface InitiateEsewaResponse {
  success: boolean;
  message: string;
  paymentId: string;
  esewaUrl: string;
  esewaPayload: EsewaPayload;
}

export interface Payment {
  id: string;
  amount: number;
  tipAmount: number;
  totalAmount: number;
  transactionUuid: string;
  esewaRefId?: string;
  status: "initiated" | "pending" | "completed" | "failed" | "refunded";
  paidAt?: string;
}

export interface VerifyEsewaResponse {
  success: boolean;
  message: string;
  payment: Payment;
}

export interface MyPaymentsResponse {
  success: boolean;
  payments: {
    _id: string;
    amount: number;
    tipAmount: number;
    totalAmount: number;
    transactionUuid: string;
    esewaRefId?: string;
    gateway: string;
    status: "initiated" | "pending" | "completed" | "failed" | "refunded";
    anonymous: boolean;
    paidAt?: string;
    createdAt: string;
    campaign?: {
      _id: string;
      title: string;
      status: string;
      images?: { url: string };
    } | null;
    team?: {
      _id: string;
      name: string;
      status: string;
      avatar?: { url: string };
    } | null;
  }[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CampaignPaymentsResponse {
  success: boolean;
  payments: {
    _id: string;
    amount: number;
    tipAmount: number;
    totalAmount: number;
    donor: {
      _id: string;
      name: string;
      email: string;
      avatar?: { url: string };
      badge?: string;
    } | null;
    anonymous: boolean;
    status: string;
    paidAt: string;
    createdAt: string;
  }[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetAllPaymentsStats {
  totalRevenue: number;
  completedCount: number;
  pendingAmount: number;
  statusCounts: Record<string, number>;
  methodRevenue: Record<string, number>;
  methodCounts: Record<string, number>;
  averageTransaction: number;
  trends: {
    revenue: number;
    completedCount: number;
    averageTransaction: number;
    pendingAmount: number;
  };
}

export interface GetAllPaymentsResponse {
  success: boolean;
  payments: {
    _id: string;
    amount: number;
    tipAmount: number;
    totalAmount: number;
    transactionUuid: string;
    esewaRefId?: string;
    gateway: string;
    status: "initiated" | "pending" | "completed" | "failed" | "refunded";
    anonymous: boolean;
    paidAt?: string;
    createdAt: string;
    campaign?: {
      _id: string;
      title: string;
      status: string;
      images?: { url: string };
    } | null;
    donor?: {
      _id: string;
      name: string;
      email: string;
    } | null;
  }[];
  stats: GetAllPaymentsStats;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};
export const useInitiateEsewaPayment = () => {
  return useMutation<InitiateEsewaResponse, Error, InitiateEsewaPayload>({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post<InitiateEsewaResponse>(
        "/payments/esewa/initiate",
        payload,
      );
      return res.data;
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to initiate payment."));
    },
  });
};

export const useVerifyEsewaPayment = (encodedData: string) => {
  return useQuery<VerifyEsewaResponse, Error>({
    queryKey: ["esewa-verify", encodedData],
    queryFn: async () => {
      const res = await axiosInstance.get<VerifyEsewaResponse>(
        `/payments/esewa/verify?data=${encodedData}`,
      );
      return res.data;
    },
    enabled: !!encodedData,
    retry: false,
  });
};

export const useGetMyPayments = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery<MyPaymentsResponse, Error>({
    queryKey: ["payments", "mine", params],
    queryFn: async () => {
      const res = await axiosInstance.get<MyPaymentsResponse>("/payments/my", {
        params,
      });
      return res.data;
    },
  });
};

export const useGetCampaignPayments = (
  campaignId: string,
  params?: {
    page?: number;
    limit?: number;
  },
) => {
  return useQuery<CampaignPaymentsResponse, Error>({
    queryKey: ["payments", "campaign", campaignId, params],
    queryFn: async () => {
      const res = await axiosInstance.get<CampaignPaymentsResponse>(
        `/payments/campaign/${campaignId}`,
        { params },
      );
      return res.data;
    },
    enabled: !!campaignId,
  });
};

export const useGetAllPayments = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery<GetAllPaymentsResponse, Error>({
    queryKey: ["payments", "all", params],
    queryFn: async () => {
      const res = await axiosInstance.get<GetAllPaymentsResponse>("/payments", {
        params,
      });
      return res.data;
    },
  });
};

export const submitEsewaForm = (esewaUrl: string, payload: EsewaPayload) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = esewaUrl;

  Object.entries(payload).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

// ─── Admin CRUD Operations ───────────────────────────────────────────────────

export interface UpdatePaymentStatusPayload {
  status: "initiated" | "pending" | "completed" | "failed" | "refunded";
  refundReason?: string;
}

export interface CreateManualPaymentPayload {
  campaignId: string;
  donorId?: string;
  amount: number;
  tipAmount?: number;
  anonymous?: boolean;
  notes?: string;
}

export interface PaymentUpdateResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    status: string;
    refundReason?: string;
    refundedAt?: string;
  };
}

export interface PaymentCreateResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    transactionUuid: string;
    amount: number;
    status: string;
    campaign: { title: string };
    donor?: { name: string; email: string };
  };
}

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<PaymentUpdateResponse, Error, { id: string; payload: UpdatePaymentStatusPayload }>({
    mutationFn: async ({ id, payload }) => {
      const res = await axiosInstance.put<PaymentUpdateResponse>(`/payments/${id}`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Payment status updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update payment status."));
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/payments/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Payment deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete payment."));
    },
  });
};

export const useCreateManualPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<PaymentCreateResponse, Error, CreateManualPaymentPayload>({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post<PaymentCreateResponse>("/payments/manual", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Manual payment created successfully.");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create manual payment."));
    },
  });
};
