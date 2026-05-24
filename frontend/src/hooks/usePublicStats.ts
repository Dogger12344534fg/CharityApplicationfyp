import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/axiosInstance";

export interface PublicStats {
  activeCampaigns: number;
  completedCampaigns: number;
  totalRaised: number;
  totalDonors: number;
  activeTeams: number;
  teamCampaigns: number;
  teamRaised: number;
  goodsPackages: number;
}

export const formatNPR = (n: number): string => {
  if (n >= 10_000_000) return `NPR ${(n / 10_000_000).toFixed(1)}Cr+`;
  if (n >= 100_000) return `NPR ${(n / 100_000).toFixed(0)}L+`;
  if (n >= 1_000) return `NPR ${(n / 1_000).toFixed(0)}K+`;
  return `NPR ${n}+`;
};

export const formatCount = (n: number): string => {
  if (n >= 10_000) return `${Math.round(n / 1_000)}K+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K+`;
  return `${n}+`;
};

export const usePublicStats = () => {
  return useQuery<{ success: boolean; data: PublicStats }, Error>({
    queryKey: ["public-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/public-stats");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};