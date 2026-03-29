import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { axiosInstance } from "../services/axiosInstance";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CampaignImage {
	url: string;
	publicId: string;
}

export interface CampaignLocation {
	_id: string;
	name: string;
	coordinates: [number, number];
	address?: string;
	city?: string;
	state?: string;
	country?: string;
	zipCode?: string;
}

export interface Campaign {
	_id: string;
	title: string;
	description: string;
	category: { _id: string; name: string };
	createdBy: { _id: string; name: string; email: string };
	goalAmount: number;
	raisedAmount: number;
	images: CampaignImage;
	urgent: boolean;
	location: CampaignLocation;
	startDate: string;
	endDate?: string;
	status: "pending" | "active" | "completed" | "rejected" | "suspended";
	rejectionReason?: string | null;
	suspendedReason?: string;
	approvedBy?: { _id: string; name: string; email: string };
	approvedAt?: string;
	donorsCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface Pagination {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CampaignListResponse {
	success: boolean;
	campaigns: Campaign[];
	pagination: Pagination;
}

export interface CampaignResponse {
	success: boolean;
	message?: string;
	data: Campaign;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface GetCampaignsParams {
	page?: number;
	limit?: number;
	status?: string;
	category?: string;
	urgent?: boolean;
	search?: string;
	sortBy?: string;
	order?: "asc" | "desc";
}

// ─── Mutation Payloads ────────────────────────────────────────────────────────

export interface CreateCampaignPayload {
	title: string;
	description: string;
	category: string;
	goalAmount: number;
	urgent?: boolean;
	endDate?: string;
	locationName?: string;
	longitude?: number;
	latitude?: number;
	address?: string;
	city?: string;
	state?: string;
	country?: string;
	zipCode?: string;
	locationId?: string;
	image: File;
}

export interface UpdateCampaignPayload extends Partial<
	Omit<CreateCampaignPayload, "image">
> {
	id: string;
	image?: File;
}

export interface StatusReasonPayload {
	id: string;
	reason: string;
}

// ─── Helper: build FormData ───────────────────────────────────────────────────

const toFormData = (payload: Record<string, unknown>): FormData => {
	const form = new FormData();
	Object.entries(payload).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		if (value instanceof File) {
			form.append(key, value);
		} else {
			form.append(key, String(value));
		}
	});
	return form;
};

// ─── Error resolver ───────────────────────────────────────────────────────────

const getErrorMessage = (error: unknown, fallback: string): string => {
	if (axios.isAxiosError(error)) {
		return error.response?.data?.message || fallback;
	}
	return fallback;
};

// ═════════════════════════════════════════════════════════════════════════════
// QUERY HOOKS
// ═════════════════════════════════════════════════════════════════════════════

// ─── Get All Campaigns ────────────────────────────────────────────────────────
export const useGetAllCampaigns = (params?: GetCampaignsParams) => {
	return useQuery<CampaignListResponse, Error>({
		queryKey: ["campaigns", params],
		queryFn: async () => {
			const res = await axiosInstance.get<CampaignListResponse>("/campaigns", {
				params,
			});
			return res.data;
		},
	});
};

// ─── Get Campaign By ID ───────────────────────────────────────────────────────
export const useGetCampaignById = (id: string) => {
	return useQuery<CampaignResponse, Error>({
		queryKey: ["campaign", id],
		queryFn: async () => {
			const res = await axiosInstance.get<CampaignResponse>(`/campaigns/${id}`);
			return res.data;
		},
		enabled: !!id,
	});
};

// ─── Get My Campaigns ─────────────────────────────────────────────────────────
export const useGetMyCampaigns = (
	params?: Pick<GetCampaignsParams, "page" | "limit" | "status">,
) => {
	return useQuery<CampaignListResponse, Error>({
		queryKey: ["campaigns", "mine", params],
		queryFn: async () => {
			const res = await axiosInstance.get<CampaignListResponse>(
				"/campaigns/user/my-campaigns",
				{ params },
			);
			return res.data;
		},
	});
};

// ═════════════════════════════════════════════════════════════════════════════
// MUTATION HOOKS
// ═════════════════════════════════════════════════════════════════════════════

// ─── Create Campaign ──────────────────────────────────────────────────────────
export const useCreateCampaign = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation<CampaignResponse, Error, CreateCampaignPayload>({
		mutationFn: async (payload) => {
			const { image, ...rest } = payload;
			const form = toFormData({ ...rest, image });
			const res = await axiosInstance.post<CampaignResponse>(
				"/campaigns",
				form,
				{ headers: { "Content-Type": "multipart/form-data" } },
			);
			return res.data;
		},

		onSuccess: (data) => {
			toast.success(data.message || "Campaign created successfully.");
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			router.push("/my-campaigns");
		},

		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to create campaign."));
		},
	});
};

// ─── Update Campaign ──────────────────────────────────────────────────────────
export const useUpdateCampaign = () => {
	const queryClient = useQueryClient();

	return useMutation<CampaignResponse, Error, UpdateCampaignPayload>({
		mutationFn: async ({ id, image, ...rest }) => {
			const form = toFormData(image ? { ...rest, image } : rest);
			const res = await axiosInstance.put<CampaignResponse>(
				`/campaigns/${id}`,
				form,
				{ headers: { "Content-Type": "multipart/form-data" } },
			);
			return res.data;
		},

		onSuccess: (data) => {
			toast.success(data.message || "Campaign updated successfully.");
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			queryClient.invalidateQueries({ queryKey: ["campaign", data.data._id] });
		},

		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to update campaign."));
		},
	});
};

// ─── Delete Campaign ──────────────────────────────────────────────────────────
export const useDeleteCampaign = () => {
	const queryClient = useQueryClient();

	return useMutation<{ success: boolean; message: string }, Error, string>({
		mutationFn: async (id) => {
			const res = await axiosInstance.delete(`/campaigns/${id}`);
			return res.data;
		},

		onSuccess: (data) => {
			toast.success(data.message || "Campaign deleted.");
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
		},

		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to delete campaign."));
		},
	});
};

// ─── Approve Campaign ─────────────────────────────────────────────────────────
export const useApproveCampaign = () => {
	const queryClient = useQueryClient();

	return useMutation<CampaignResponse, Error, string>({
		mutationFn: async (id) => {
			const res = await axiosInstance.patch<CampaignResponse>(
				`/campaigns/${id}/approve`,
			);
			return res.data;
		},

		onSuccess: (data) => {
			toast.success(data.message || "Campaign approved.");
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			queryClient.invalidateQueries({ queryKey: ["campaign", data.data._id] });
		},

		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to approve campaign."));
		},
	});
};

// ─── Reject Campaign ──────────────────────────────────────────────────────────
export const useRejectCampaign = () => {
	const queryClient = useQueryClient();

	return useMutation<CampaignResponse, Error, StatusReasonPayload>({
		mutationFn: async ({ id, reason }) => {
			const res = await axiosInstance.patch<CampaignResponse>(
				`/campaigns/${id}/reject`,
				{ rejectionReason: reason },
			);
			return res.data;
		},

		onSuccess: (data) => {
			toast.success(data.message || "Campaign rejected.");
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			queryClient.invalidateQueries({ queryKey: ["campaign", data.data._id] });
		},

		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to reject campaign."));
		},
	});
};

// ─── Suspend Campaign ─────────────────────────────────────────────────────────
export const useSuspendCampaign = () => {
	const queryClient = useQueryClient();

	return useMutation<CampaignResponse, Error, StatusReasonPayload>({
		mutationFn: async ({ id, reason }) => {
			const res = await axiosInstance.patch<CampaignResponse>(
				`/campaigns/${id}/suspend`,
				{ suspendedReason: reason },
			);
			return res.data;
		},

		onSuccess: (data) => {
			toast.success(data.message || "Campaign suspended.");
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			queryClient.invalidateQueries({ queryKey: ["campaign", data.data._id] });
		},

		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to suspend campaign."));
		},
	});
};

// ─── Unsuspend Campaign ───────────────────────────────────────────────────────
export const useUnsuspendCampaign = () => {
	const queryClient = useQueryClient();

	return useMutation<CampaignResponse, Error, string>({
		mutationFn: async (id) => {
			const res = await axiosInstance.patch<CampaignResponse>(
				`/campaigns/${id}/unsuspend`,
			);
			return res.data;
		},

		onSuccess: (data) => {
			toast.success(data.message || "Campaign reactivated.");
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			queryClient.invalidateQueries({ queryKey: ["campaign", data.data._id] });
		},

		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to reactivate campaign."));
		},
	});
};
