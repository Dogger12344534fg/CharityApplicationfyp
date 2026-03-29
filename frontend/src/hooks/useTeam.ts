import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { axiosInstance } from "../services/axiosInstance";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeamAvatar {
  url: string;
  publicId: string;
}

export interface TeamMember {
  user: { _id: string; name: string; email: string };
  role: "admin" | "member";
  joinedAt: string;
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
  invites: TeamInvite[];
  campaigns: {
    _id: string;
    title: string;
    status: string;
    raisedAmount: number;
    goalAmount: number;
  }[];
  status: "active" | "suspended" | "disbanded";
  badge?: "Top Team" | "Verified" | null;
  memberCount: number;
  campaignCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TeamListResponse {
  success: boolean;
  teams: Team[];
  pagination: Pagination;
}

export interface TeamResponse {
  success: boolean;
  message?: string;
  data: Team;
}

export interface LeaderboardTeam extends Omit<Team, "invites" | "campaigns"> {
  rank: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardTeam[];
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface GetTeamsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  privacy?: "public" | "private";
  sortBy?: string;
  order?: "asc" | "desc";
}

// ─── Mutation Payloads ────────────────────────────────────────────────────────

export interface CreateTeamPayload {
  name: string;
  description: string;
  location: string;
  privacy?: "public" | "private";
  category: string;
  goalAmount: number;
  website?: string;
  inviteEmails?: string; // JSON stringified array
  avatar?: File;
}

export interface UpdateTeamPayload extends Partial<
  Omit<CreateTeamPayload, "avatar">
> {
  id: string;
  avatar?: File;
}

export interface InviteMembersPayload {
  id: string;
  emails: string[];
}

export interface AddCampaignPayload {
  id: string;
  campaignId: string;
}

export interface RemoveMemberPayload {
  id: string;
  memberId: string;
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

// ─── Get All Teams ────────────────────────────────────────────────────────────
export const useGetAllTeams = (params?: GetTeamsParams) => {
  return useQuery<TeamListResponse, Error>({
    queryKey: ["teams", params],
    queryFn: async () => {
      const res = await axiosInstance.get<TeamListResponse>("/teams", {
        params,
      });
      return res.data;
    },
  });
};

// ─── Get Team By ID ───────────────────────────────────────────────────────────
export const useGetTeamById = (id: string) => {
  return useQuery<TeamResponse, Error>({
    queryKey: ["team", id],
    queryFn: async () => {
      const res = await axiosInstance.get<TeamResponse>(`/teams/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

// ─── Get My Teams ─────────────────────────────────────────────────────────────
export const useGetMyTeams = (
  params?: Pick<GetTeamsParams, "page" | "limit">,
) => {
  return useQuery<TeamListResponse, Error>({
    queryKey: ["teams", "mine", params],
    queryFn: async () => {
      const res = await axiosInstance.get<TeamListResponse>(
        "/teams/user/my-teams",
        { params },
      );
      return res.data;
    },
  });
};

// ─── Get Leaderboard ─────────────────────────────────────────────────────────
export const useGetTeamLeaderboard = (limit = 10) => {
  return useQuery<LeaderboardResponse, Error>({
    queryKey: ["teams", "leaderboard", limit],
    queryFn: async () => {
      const res = await axiosInstance.get<LeaderboardResponse>(
        "/teams/leaderboard",
        {
          params: { limit },
        },
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};

// ═════════════════════════════════════════════════════════════════════════════
// MUTATION HOOKS
// ═════════════════════════════════════════════════════════════════════════════

// ─── Create Team ──────────────────────────────────────────────────────────────
export const useCreateTeam = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<TeamResponse, Error, CreateTeamPayload>({
    mutationFn: async (payload) => {
      const { avatar, ...rest } = payload;
      const form = toFormData(avatar ? { ...rest, avatar } : rest);
      const res = await axiosInstance.post<TeamResponse>("/teams", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Team created successfully.");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      router.push("/teams");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create team."));
    },
  });
};

// ─── Update Team ──────────────────────────────────────────────────────────────
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<TeamResponse, Error, UpdateTeamPayload>({
    mutationFn: async ({ id, avatar, ...rest }) => {
      const form = toFormData(avatar ? { ...rest, avatar } : rest);
      const res = await axiosInstance.put<TeamResponse>(`/teams/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Team updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team", data.data._id] });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update team."));
    },
  });
};

// ─── Delete Team ──────────────────────────────────────────────────────────────
export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/teams/${id}`);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Team deleted.");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete team."));
    },
  });
};

// ─── Join Team ────────────────────────────────────────────────────────────────
export const useJoinTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<TeamResponse, Error, string>({
    mutationFn: async (id) => {
      const res = await axiosInstance.post<TeamResponse>(`/teams/${id}/join`);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "You've joined the team!");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team", data.data._id] });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to join team."));
    },
  });
};

// ─── Leave Team ───────────────────────────────────────────────────────────────
export const useLeaveTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (id) => {
      const res = await axiosInstance.post(`/teams/${id}/leave`);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "You've left the team.");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to leave team."));
    },
  });
};

// ─── Invite Members ───────────────────────────────────────────────────────────
export const useInviteMembers = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    InviteMembersPayload
  >({
    mutationFn: async ({ id, emails }) => {
      const res = await axiosInstance.post(`/teams/${id}/invite`, { emails });
      return res.data;
    },

    onSuccess: (data, variables) => {
      toast.success(data.message || "Invites sent successfully.");
      queryClient.invalidateQueries({ queryKey: ["team", variables.id] });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to send invites."));
    },
  });
};

// ─── Remove Member ────────────────────────────────────────────────────────────
export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation<TeamResponse, Error, RemoveMemberPayload>({
    mutationFn: async ({ id, memberId }) => {
      const res = await axiosInstance.delete<TeamResponse>(
        `/teams/${id}/members/${memberId}`,
      );
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Member removed.");
      queryClient.invalidateQueries({ queryKey: ["team", data.data._id] });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to remove member."));
    },
  });
};

// ─── Add Campaign to Team ─────────────────────────────────────────────────────
export const useAddCampaignToTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<TeamResponse, Error, AddCampaignPayload>({
    mutationFn: async ({ id, campaignId }) => {
      const res = await axiosInstance.post<TeamResponse>(
        `/teams/${id}/campaign`,
        { campaignId },
      );
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Campaign added to team.");
      queryClient.invalidateQueries({ queryKey: ["team", data.data._id] });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to add campaign to team."));
    },
  });
};

export const useGetAllTeamsAdmin = (query: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ["teams", "admin", query],
    queryFn: () =>
      axiosInstance
        .get("/teams/admin/all", { params: query })
        .then((r) => r.data),
  });
};
export const useApproveTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.patch(`/teams/${id}/approve`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
};
export const useRejectTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      rejectionReason,
    }: {
      id: string;
      rejectionReason: string;
    }) =>
      axiosInstance
        .patch(`/teams/${id}/reject`, { rejectionReason })
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
};
export const useSuspendTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      suspendedReason,
    }: {
      id: string;
      suspendedReason: string;
    }) =>
      axiosInstance
        .patch(`/teams/${id}/suspend`, { suspendedReason })
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
};
export const useUnsuspendTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.patch(`/teams/${id}/unsuspend`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
};
