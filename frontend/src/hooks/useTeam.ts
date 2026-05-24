import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { axiosInstance } from "../services/axiosInstance";
import axios from "axios";
import type { ChatMessage } from "./useTeamChat";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeamAvatar { url: string; publicId: string; }

export interface TeamMember {
  user: { _id: string; name: string; email: string };
  role: "admin" | "member";
  joinedAt: string;
}

export interface JoinRequest {
  _id: string;
  user: { _id: string; name: string; email: string };
  status: "pending" | "approved" | "rejected";
  message?: string;
  requestedAt: string;
  respondedAt?: string;
}

export interface TeamInvite {
  email: string;
  invitedAt: string;
  status: "pending" | "accepted" | "declined";
}

export interface Team {
  _id: string;
  name: string;
  description: string;
  avatar?: TeamAvatar | null;
  location: string;
  privacy: "public" | "private";
  category: string;
  goalAmount: number;
  raisedAmount: number;
  website?: string | null;
  createdBy: { _id: string; name: string; email: string };
  members: TeamMember[];
  joinRequests: JoinRequest[];
  invites: TeamInvite[];
  campaigns: { _id: string; title: string; status: string; raisedAmount: number; goalAmount: number; }[];
  status: "pending" | "active" | "rejected" | "suspended" | "disbanded";
  badge?: "Top Team" | "Verified" | null;
  memberCount: number;
  campaignCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination { total: number; page: number; limit: number; totalPages: number; }
export interface TeamListResponse { success: boolean; teams: Team[]; pagination: Pagination; }
export interface TeamResponse { success: boolean; message?: string; data: Team; }
export interface LeaderboardTeam extends Omit<Team, "invites" | "campaigns"> { rank: number; }
export interface LeaderboardResponse { success: boolean; data: LeaderboardTeam[]; }
export interface TeamMessagesResponse { success: boolean; data: ChatMessage[]; }

export interface GetTeamsParams {
  page?: number; limit?: number; search?: string;
  category?: string; privacy?: "public" | "private";
  sortBy?: string; order?: "asc" | "desc";
}

export interface CreateTeamPayload {
  name: string; description: string; location: string;
  privacy?: "public" | "private"; category: string; goalAmount: number;
  website?: string; inviteEmails?: string; avatar?: File;
}

export interface UpdateTeamPayload extends Partial<Omit<CreateTeamPayload, "avatar">> {
  id: string; avatar?: File;
}

export interface InviteMembersPayload { id: string; emails: string[]; }
export interface AddCampaignPayload { id: string; campaignId: string; }
export interface RemoveMemberPayload { id: string; memberId: string; }

export interface InviteTokenData {
  team: {
    _id: string;
    name: string;
    description: string;
    avatar?: { url: string; publicId: string } | null;
    location: string;
    category: string;
    memberCount: number;
    createdBy: { _id: string; name: string; email: string };
  };
  invite: {
    email: string;
    invitedAt: string;
    tokenExpiry: string | null;
  };
}
export interface ValidateInviteTokenResponse { success: boolean; data: InviteTokenData; }

// ─── Team Donation ────────────────────────────────────────────────────────────
export interface InitiateTeamDonationPayload {
  teamId: string;
  amount: number;
  tipAmount: number;
  anonymous: boolean;
}

// Matches exact same shape as campaign payment response
export interface InitiateTeamDonationResponse {
  success: boolean;
  message: string;
  paymentId: string;
  esewaUrl: string;
  esewaPayload: {
    amount: string;
    tax_amount: string;
    total_amount: string;
    transaction_uuid: string;
    product_code: string;
    product_service_charge: string;
    product_delivery_charge: string;
    success_url: string;
    failure_url: string;
    signed_field_names: string;
    signature: string;
  };
}

export interface TeamDonationPayment {
  _id: string;
  amount: number;
  tipAmount: number;
  totalAmount: number;
  transactionUuid: string;
  esewaRefId?: string;
  status: string;
}

export interface VerifyTeamDonationResponse {
  success: boolean;
  payment: TeamDonationPayment;
}

const toFormData = (payload: Record<string, unknown>): FormData => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) form.append(key, value);
    else form.append(key, String(value));
  });
  return form;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) return error.response?.data?.message || fallback;
  return fallback;
};

// ═════════════════════════════════════════════════════════════════════════════
// QUERY HOOKS
// ═════════════════════════════════════════════════════════════════════════════

export const useGetAllTeams = (params?: GetTeamsParams) =>
  useQuery<TeamListResponse, Error>({
    queryKey: ["teams", params],
    queryFn: async () => (await axiosInstance.get<TeamListResponse>("/teams", { params })).data,
  });

export const useGetTeamById = (id: string, options?: { refetchInterval?: number | false; refetchOnMount?: boolean | "always" }) =>
  useQuery<TeamResponse, Error>({
    queryKey: ["team", id],
    queryFn: async () => (await axiosInstance.get<TeamResponse>(`/teams/${id}`)).data,
    enabled: !!id,
    ...options,
  });

export const useGetMyTeams = (params?: Pick<GetTeamsParams, "page" | "limit">) =>
  useQuery<TeamListResponse, Error>({
    queryKey: ["teams", "mine", params],
    queryFn: async () => (await axiosInstance.get<TeamListResponse>("/teams/user/my-teams", { params })).data,
  });

export const useGetTeamLeaderboard = (limit = 10) =>
  useQuery<LeaderboardResponse, Error>({
    queryKey: ["teams", "leaderboard", limit],
    queryFn: async () => (await axiosInstance.get<LeaderboardResponse>("/teams/leaderboard", { params: { limit } })).data,
    staleTime: 1000 * 60 * 5,
  });

export const useGetTeamMessages = (teamId: string, enabled = true) =>
  useQuery<TeamMessagesResponse, Error>({
    queryKey: ["team-messages", teamId],
    queryFn: async () => (await axiosInstance.get<TeamMessagesResponse>(`/teams/${teamId}/messages`, { params: { limit: 50 } })).data,
    enabled: !!teamId && enabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

// ─── Verify team eSewa payment ────────────────────────────────────────────────
export const useVerifyTeamEsewaPayment = (encodedData: string) =>
  useQuery<VerifyTeamDonationResponse, Error>({
    queryKey: ["team-payment-verify", encodedData],
    queryFn: async () =>
      (await axiosInstance.get<VerifyTeamDonationResponse>(
        `/payments/esewa/verify?data=${encodedData}`
      )).data,
    enabled: !!encodedData,
    retry: false,
  });

// ═════════════════════════════════════════════════════════════════════════════
// MUTATION HOOKS
// ═════════════════════════════════════════════════════════════════════════════

export const useCreateTeam = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<TeamResponse, Error, CreateTeamPayload>({
    mutationFn: async (payload) => {
      const { avatar, ...rest } = payload;
      const form = toFormData(avatar ? { ...rest, avatar } : rest);
      return (await axiosInstance.post<TeamResponse>("/teams", form, { headers: { "Content-Type": "multipart/form-data" } })).data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Team created successfully.");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      router.push("/teams");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to create team.")),
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<TeamResponse, Error, UpdateTeamPayload>({
    mutationFn: async ({ id, avatar, ...rest }) => {
      const form = toFormData(avatar ? { ...rest, avatar } : rest);
      return (await axiosInstance.put<TeamResponse>(`/teams/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } })).data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Team updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team", data.data._id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to update team.")),
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (id) => (await axiosInstance.delete(`/teams/${id}`)).data,
    onSuccess: (data) => {
      toast.success(data.message || "Team deleted.");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to delete team.")),
  });
};

export const useRequestJoinTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, { id: string; message?: string }>({
    mutationFn: async ({ id, message }) => (await axiosInstance.post(`/teams/${id}/join`, { message })).data,
    onSuccess: (data, variables) => {
      toast.success(data.message || "Join request sent!");
      queryClient.invalidateQueries({ queryKey: ["team", variables.id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to send join request.")),
  });
};

export const useApproveJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<TeamResponse, Error, { teamId: string; requestId: string }>({
    mutationFn: async ({ teamId, requestId }) =>
      (await axiosInstance.post<TeamResponse>(`/teams/${teamId}/join-requests/${requestId}/approve`)).data,
    onSuccess: (data) => {
      toast.success("Join request approved.");
      queryClient.invalidateQueries({ queryKey: ["team", data.data._id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to approve request.")),
  });
};

export const useRejectJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, { teamId: string; requestId: string }>({
    mutationFn: async ({ teamId, requestId }) =>
      (await axiosInstance.post(`/teams/${teamId}/join-requests/${requestId}/reject`)).data,
    onSuccess: (_, variables) => {
      toast.success("Join request rejected.");
      queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to reject request.")),
  });
};

export const useLeaveTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (id) => (await axiosInstance.post(`/teams/${id}/leave`)).data,
    onSuccess: (data) => {
      toast.success(data.message || "You've left the team.");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to leave team.")),
  });
};

export const useInviteMembers = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, InviteMembersPayload>({
    mutationFn: async ({ id, emails }) => (await axiosInstance.post(`/teams/${id}/invite`, { emails })).data,
    onSuccess: (data, variables) => {
      toast.success(data.message || "Invites sent successfully.");
      queryClient.invalidateQueries({ queryKey: ["team", variables.id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to send invites.")),
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation<TeamResponse, Error, RemoveMemberPayload>({
    mutationFn: async ({ id, memberId }) =>
      (await axiosInstance.delete<TeamResponse>(`/teams/${id}/members/${memberId}`)).data,
    onSuccess: (data) => {
      toast.success(data.message || "Member removed.");
      queryClient.invalidateQueries({ queryKey: ["team", data.data._id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to remove member.")),
  });
};

export const useAddCampaignToTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<TeamResponse, Error, AddCampaignPayload>({
    mutationFn: async ({ id, campaignId }) =>
      (await axiosInstance.post<TeamResponse>(`/teams/${id}/campaign`, { campaignId })).data,
    onSuccess: (data) => {
      toast.success(data.message || "Campaign added to team.");
      queryClient.invalidateQueries({ queryKey: ["team", data.data._id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to add campaign to team.")),
  });
};

// ─── Initiate team eSewa payment ──────────────────────────────────────────────
// Backend: POST /api/payments/teams/esewa/initiate
// Accepts teamId — backend finds team's active campaign internally
export const useInitiateTeamEsewaPayment = () =>
  useMutation<InitiateTeamDonationResponse, Error, InitiateTeamDonationPayload>({
    mutationFn: async (payload) =>
      (await axiosInstance.post<InitiateTeamDonationResponse>(
        "/payments/esewa/initiate",
        payload
      )).data,
    onError: (error) => toast.error(getErrorMessage(error, "Failed to initiate payment.")),
  });

// ── Admin hooks ───────────────────────────────────────────────────────────────

export const useGetAllTeamsAdmin = (query: Record<string, unknown> = {}) =>
  useQuery({
    queryKey: ["teams", "admin", query],
    queryFn: () => axiosInstance.get("/teams/admin/all", { params: query }).then((r) => r.data),
  });

export const useApproveTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.patch(`/teams/${id}/approve`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
};

export const useRejectTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
      axiosInstance.patch(`/teams/${id}/reject`, { rejectionReason }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
};

export const useSuspendTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, suspendedReason }: { id: string; suspendedReason: string }) =>
      axiosInstance.patch(`/teams/${id}/suspend`, { suspendedReason }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
};

export const useUnsuspendTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.patch(`/teams/${id}/unsuspend`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
};

// ─── Invite token hooks ───────────────────────────────────────────────────────

export const useValidateInviteToken = (token: string) =>
  useQuery<ValidateInviteTokenResponse, Error>({
    queryKey: ["team-invite", token],
    queryFn: async () =>
      (await axiosInstance.get<ValidateInviteTokenResponse>(`/teams/invite/${token}`)).data,
    enabled: !!token,
    retry: false,
  });

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();
  return useMutation<TeamResponse, Error, string>({
    mutationFn: async (token) =>
      (await axiosInstance.post<TeamResponse>(`/teams/invite/${token}/accept`)).data,
    onSuccess: (data) => {
      toast.success("You've joined the team!");
      // Remove (not just invalidate) so the team page always fetches fresh member data
      queryClient.removeQueries({ queryKey: ["team", data.data._id] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to accept invite.")),
  });
};