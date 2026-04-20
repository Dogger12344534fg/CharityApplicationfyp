// // ═══════════════════════════════════════════════
// // REACTION HOOKS
// // ═══════════════════════════════════════════════

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { axiosInstance } from "../services/axiosInstance";
// import { toast } from "sonner";
// import { CampaignReactions, getErrorMessage } from "./useCampaign";

// export interface ReactionsResponse {
//   success: boolean;
//   reactions: CampaignReactions;
//   total: number;
// }

// export interface MyReactionResponse {
//   success: boolean;
//   reactionType: "love" | "support" | "sad" | "grateful" | "urgent" | null;
// }

// export const useGetCampaignReactions = (campaignId: string) => {
//   return useQuery<ReactionsResponse, Error>({
//     queryKey: ["reactions", campaignId],
//     queryFn: async () => {
//       const res = await axiosInstance.get<ReactionsResponse>(
//         `/campaigns/${campaignId}/reactions`,
//       );
//       return res.data;
//     },
//     enabled: !!campaignId,
//     staleTime: 1000 * 30,
//   });
// };

// export const useGetMyReaction = (campaignId: string) => {
//   return useQuery<MyReactionResponse, Error>({
//     queryKey: ["reactions", campaignId, "mine"],
//     queryFn: async () => {
//       const res = await axiosInstance.get<MyReactionResponse>(
//         `/campaigns/${campaignId}/reactions/mine`,
//       );
//       return res.data;
//     },
//     enabled: !!campaignId,
//     staleTime: 1000 * 60,
//   });
// };

// export const useToggleReaction = (campaignId: string) => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     ReactionsResponse & { action: string; reactionType: string | null },
//     Error,
//     string
//   >({
//     mutationFn: async (type) => {
//       const res = await axiosInstance.post(
//         `/campaigns/${campaignId}/reactions`,
//         { type },
//       );
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["reactions", campaignId] });
//       queryClient.invalidateQueries({
//         queryKey: ["reactions", campaignId, "mine"],
//       });
//     },
//     onError: (error) => {
//       toast.error(getErrorMessage(error, "Failed to react."));
//     },
//   });
// };