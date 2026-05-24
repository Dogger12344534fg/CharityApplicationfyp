import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { axiosInstance } from "../services/axiosInstance";
import axios from "axios";

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

export interface CampaignDocument {
	_id: string;
	url: string;
	publicId: string;
	name: string;
	type:
		| "wada_registration"
		| "ngo_certificate"
		| "tax_clearance"
		| "bank_details"
		| "identity"
		| "other";
	uploadedAt: string;
}

export interface CampaignReactions {
	love: number;
	support: number;
	sad: number;
	grateful: number;
	urgent: number;
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
	documents: CampaignDocument[];
	reactions: CampaignReactions;
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
	phoneNumber?: string;
	esewaId?: string;
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

export interface CreateCampaignPayload {
	title: string;
	description: string;
	category: string;
	goalAmount: number;
	urgent?: boolean;
	endDate?: string;
	phoneNumber?: string;
	esewaId?: string;
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
	documents?: File[];
	documentNames?: string[];
	documentTypes?: string[];
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
		} else if (Array.isArray(value)) {
			value.forEach((item) => {
				if (item instanceof File) {
					form.append(key, item);
				} else {
					form.append(key, String(item));
				}
			});
		} else {
			form.append(key, String(value));
		}
	});
	return form;
};

// ─── Error resolver ───────────────────────────────────────────────────────────
export const getErrorMessage = (error: unknown, fallback: string): string => {
	if (axios.isAxiosError(error)) {
		return error.response?.data?.message || fallback;
	}
	return fallback;
};

// ═══════════════════════════════════════════════
// CAMPAIGN QUERIES
// ═══════════════════════════════════════════════

export const useGetAllCampaigns = (params?: GetCampaignsParams) => {
	return useQuery<CampaignListResponse, Error>({
		queryKey: ["campaigns", params],
		queryFn: async () => {
			const res = await axiosInstance.get<CampaignListResponse>("/campaigns", {
				params,
			});

			console.log(res.data);

			return res.data;
		},
	});
};

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

// ═══════════════════════════════════════════════
// CAMPAIGN MUTATIONS
// ═══════════════════════════════════════════════

export const useCreateCampaign = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation<CampaignResponse, Error, CreateCampaignPayload>({
		mutationFn: async (payload) => {
			const { image, documents, documentNames, documentTypes, ...rest } =
				payload;
			const form = new FormData();

			// Append all scalar fields
			Object.entries(rest).forEach(([k, v]) => {
				if (v !== undefined && v !== null) form.append(k, String(v));
			});

			// Cover image — field name must be "image" (matches upload.fields)
			form.append("image", image);

			// Verification documents — field name "documents"
			if (documents?.length) {
				documents.forEach((doc) => form.append("documents", doc));
				if (documentNames?.length)
					form.append("documentNames", JSON.stringify(documentNames));
				if (documentTypes?.length)
					form.append("documentTypes", JSON.stringify(documentTypes));
			}

			const res = await axiosInstance.post<CampaignResponse>(
				"/campaigns",
				form,
				{
					headers: { "Content-Type": "multipart/form-data" },
				},
			);
			return res.data;
		},
		onSuccess: (data) => {
			toast.success(data.message || "Campaign created successfully.");
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			setTimeout(() => router.push("/my-campaigns"), 5000);
		},
		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to create campaign."));
		},
	});
};

export const useUpdateCampaign = () => {
	const queryClient = useQueryClient();

	return useMutation<CampaignResponse, Error, UpdateCampaignPayload>({
		mutationFn: async ({ id, image, ...rest }) => {
			const form = toFormData(image ? { ...rest, image } : rest);
			const res = await axiosInstance.put<CampaignResponse>(
				`/campaigns/${id}`,
				form,
				{
					headers: { "Content-Type": "multipart/form-data" },
				},
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

// ═══════════════════════════════════════════════
// RECENT DONORS (Public)
// ═══════════════════════════════════════════════

export interface RecentDonor {
	_id: string;
	name: string;
	avatar: { url: string; publicId: string } | null;
	amount: number;
	paidAt: string;
	isTop: boolean;
	anonymous: boolean;
}

export interface RecentDonorsResponse {
	success: boolean;
	donors: RecentDonor[];
}

export const useGetRecentCampaignDonors = (
	campaignId: string,
	limit = 10,
) => {
	return useQuery<RecentDonorsResponse, Error>({
		queryKey: ["campaign-donors", campaignId, limit],
		queryFn: async () => {
			const res = await axiosInstance.get<RecentDonorsResponse>(
				`/payments/campaign/${campaignId}/donors`,
				{ params: { limit } },
			);
			return res.data;
		},
		enabled: !!campaignId,
		refetchInterval: 30_000, // auto-refresh every 30s
	});
};
