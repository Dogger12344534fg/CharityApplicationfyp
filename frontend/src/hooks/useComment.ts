import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage, Pagination } from "./useCampaign";
import { axiosInstance } from "../services/axiosInstance";
import { toast } from "sonner";

export interface Comment {
  _id: string;
  campaign: string;
  author: { _id: string; name: string; avatar?: { url: string } };
  text?: string;
  media: CommentMedia[];
  likesCount: number;
  pinned: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  success: boolean;
  comments: Comment[];
  pagination: Pagination;
}

export interface CommentResponse {
  success: boolean;
  message?: string;
  data: Comment;
}

export interface CommentMedia {
  url: string;
  publicId: string;
  type: "image" | "video";
}

export interface AddCommentPayload {
  campaignId: string;
  text?: string;
  media?: File[];
}
// ═══════════════════════════════════════════════
// COMMENT HOOKS
// ═══════════════════════════════════════════════

export const useGetComments = (
  campaignId: string,
  params?: { page?: number; limit?: number },
) => {
  return useQuery<CommentsResponse, Error>({
    queryKey: ["comments", campaignId, params],
    queryFn: async () => {
      const res = await axiosInstance.get<CommentsResponse>(
        `/campaigns/${campaignId}/comments`,
        { params },
      );
      return res.data;
    },
    enabled: !!campaignId,
    staleTime: 1000 * 30,
  });
};

export const useAddComment = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, AddCommentPayload>({
    mutationFn: async ({ text, media }) => {
      const form = new FormData();
      if (text?.trim()) form.append("text", text.trim());
      media?.forEach((file) => form.append("media", file));
      const res = await axiosInstance.post<CommentResponse>(
        `/campaigns/${campaignId}/comments`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", campaignId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to post comment."));
    },
  });
};

export const useDeleteComment = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (commentId) => {
      const res = await axiosInstance.delete(
        `/campaigns/${campaignId}/comments/${commentId}`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", campaignId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete comment."));
    },
  });
};

export const useLikeComment = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; likesCount: number }, Error, string>({
    mutationFn: async (commentId) => {
      const res = await axiosInstance.post(
        `/campaigns/${campaignId}/comments/${commentId}/like`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", campaignId] });
    },
  });
};

export const useTogglePinComment = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, string>({
    mutationFn: async (commentId) => {
      const res = await axiosInstance.patch<CommentResponse>(
        `/campaigns/${campaignId}/comments/${commentId}/pin`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", campaignId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update pin status."));
    },
  });
};
