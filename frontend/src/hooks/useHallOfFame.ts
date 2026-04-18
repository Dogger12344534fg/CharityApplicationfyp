import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/axiosInstance";

export interface HallOfFameDonor {
  rank: number;
  id: string;
  name: string;
  avatar: string | null;
  location: string;
  totalDonated: number;
  donationsCount: number;
  campaignsSupported: number;
  donationStreak: number;
  badge: "gold" | "silver" | "bronze" | null;
  category: string;
  joinedDate: string;
  impact: string;
}

export interface HallOfFameTeam {
  rank: number;
  id: string;
  name: string;
  avatar: string | null;
  totalRaised: number;
  members: number;
}

export interface LeaderboardResponse {
  success: boolean;
  donors: HallOfFameDonor[];
  teams: HallOfFameTeam[];
}

export const useGetLeaderboard = (params?: { donorLimit?: number; teamLimit?: number }) => {
  return useQuery<LeaderboardResponse, Error>({
    queryKey: ["hall-of-fame-leaderboard", params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/hall-of-fame/donors", { params });
      return data;
    },
  });
};
