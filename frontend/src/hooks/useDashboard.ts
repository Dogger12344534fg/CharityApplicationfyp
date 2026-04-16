import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/axiosInstance";

export interface DashboardOverview {
  totalDonations: number;
  activeCampaigns: number;
  totalDonors: number;
  completedTransactions: number;
  trends: {
    donations: number;
    campaigns: number;
    donors: number;
    transactions: number;
  };
}

export interface CampaignStatusDistribution {
  name: string;
  value: number;
  fill: string;
}

export interface CampaignStats {
  statusDistribution: CampaignStatusDistribution[];
  totalCampaigns: number;
  totalRaised: number;
  totalGoal: number;
  avgDonorsPerCampaign: number;
}

export interface CategoryDistribution {
  _id: string;
  campaigns: number;
  donors: number;
  raised: number;
}

export interface MonthlyTrend {
  month: string;
  amount: number;
  donors: number;
}

export interface RecentTransaction {
  id: string;
  donorName: string;
  campaignTitle: string;
  amount: number;
  date: string;
  status: string;
}

export interface QuickStats {
  averageDonation: number;
  fundingProgress: number;
  pendingAmount: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  campaignStats: CampaignStats;
  categoryDistribution: CategoryDistribution[];
  monthlyTrends: MonthlyTrend[];
  recentTransactions: RecentTransaction[];
  quickStats: QuickStats;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export const useGetDashboardStats = () => {
  return useQuery<DashboardResponse, Error>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await axiosInstance.get<DashboardResponse>("/dashboard/stats");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
};