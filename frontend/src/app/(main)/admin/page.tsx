"use client";

import { useState } from "react";
import {
	TrendingUp,
	Users,
	AlertCircle,
	DollarSign,
	Heart,
	Activity,
	FileText,
	CheckCircle,
	Download,
	Loader2,
	Package,
	HandGrab,
	Folder,
} from "lucide-react";
import { toast } from "sonner";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/src/components/dashboard/DashboardCard";
import StatCard from "@/src/components/dashboard/StatCard";
import Badge from "@/src/components/dashboard/Badge";
import { useGetDashboardStats } from "@/src/hooks/useDashboard";
import formatCurrency from "@/src/utils/formatCurrency";

export default function DashboardPage() {
	const { data, isLoading, isError, error, refetch } = useGetDashboardStats();

	if (isError && !isLoading) {
		return (
			<div className="space-y-6 animate-fade-in-up">
				<div className="flex justify-between">
					<div>
						<h1 className="text-3xl font-display font-bold text-setu-900">
							Admin Dashboard
						</h1>
						<p className="text-setu-500 mt-2">
							Overview of platform statistics and activity
						</p>
					</div>
					<button
						onClick={() => refetch()}
						className="px-5 h-10 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
						Retry
					</button>
				</div>
				<div className="bg-white rounded-lg border border-red-100 p-6">
					<p className="text-red-600 font-semibold">
						Failed to load dashboard data.
					</p>
					<p className="text-sm text-red-500/90 mt-1">
						{error?.message || "Please try again."}
					</p>
				</div>
			</div>
		);
	}

	const dashboardData = data?.data;
	const overview = dashboardData?.overview;
	const campaignStats = dashboardData?.campaignStats;
	const categoryDistribution = dashboardData?.categoryDistribution || [];
	const monthlyTrends = dashboardData?.monthlyTrends || [];
	const recentTransactions = dashboardData?.recentTransactions || [];
	const quickStats = dashboardData?.quickStats;

	return (
		<div className="space-y-8 animate-fade-in-up">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-display font-bold text-setu-900">
						Admin Dashboard
					</h1>
					<p className="text-setu-500 mt-1">
						Overview of platform statistics and activity
					</p>
				</div>
				<div className="flex gap-3">
					<button 
						onClick={() => {
							const blob = new Blob([JSON.stringify(dashboardData, null, 2)], { type: "application/json" });
							const url = URL.createObjectURL(blob);
							const a = document.createElement("a");
							a.href = url;
							a.download = `setu-dashboard-stats-${new Date().toISOString().split('T')[0]}.json`;
							a.click();
						}}
						disabled={isLoading}
						className="px-4 py-2 bg-white border border-setu-300 text-setu-700 rounded-lg font-semibold hover:bg-setu-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						<Download className="w-4 h-4" />
						Download JSON
					</button>
					<button 
						onClick={() => {
							const headers = ["Title", "Value", "Subtitle"];
							const rows = [
								["Total Donations", formatCurrency(overview?.totalDonations || 0), ""],
								["Active Campaigns", overview?.activeCampaigns || 0, ""],
								["Total Donors", overview?.totalDonors || 0, ""],
								["Completed Transactions", overview?.completedTransactions || 0, ""],
								["Setu Revenue", formatCurrency(overview?.setuRevenue || 0), "from tips"],
								["Goods Donations", overview?.totalGoodsDonations || 0, `${overview?.totalGoodsItems || 0} items`],
							];
							const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
							const blob = new Blob([csvContent], { type: "text/csv" });
							const url = URL.createObjectURL(blob);
							const a = document.createElement("a");
							a.href = url;
							a.download = `setu-dashboard-summary-${new Date().toISOString().split('T')[0]}.csv`;
							a.click();
						}}
						disabled={isLoading}
						className="px-4 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						<Download className="w-4 h-4" />
						Export CSV
					</button>
				</div>
			</div>

			{/* Key Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<DashboardCard
					title="Total Donations"
					value={isLoading ? "..." : formatCurrency(overview?.totalDonations || 0)}
					icon={DollarSign}
					trend={{ 
						value: Math.abs(overview?.trends?.donations || 0), 
						direction: (overview?.trends?.donations || 0) >= 0 ? "up" : "down" 
					}}
					color="gold"
				/>
				<DashboardCard
					title="Active Campaigns"
					value={isLoading ? "..." : (overview?.activeCampaigns || 0)}
					icon={AlertCircle}
					trend={{ 
						value: Math.abs(overview?.trends?.campaigns || 0), 
						direction: (overview?.trends?.campaigns || 0) >= 0 ? "up" : "down" 
					}}
					color="green"
				/>
				<DashboardCard
					title="Total Donors"
					value={isLoading ? "..." : (overview?.totalDonors || 0)}
					icon={Users}
					trend={{ 
						value: Math.abs(overview?.trends?.donors || 0), 
						direction: (overview?.trends?.donors || 0) >= 0 ? "up" : "down" 
					}}
					color="blue"
				/>
				<DashboardCard
					title="Completed Transactions"
					value={isLoading ? "..." : (overview?.completedTransactions || 0)}
					icon={TrendingUp}
					trend={{ 
						value: Math.abs(overview?.trends?.transactions || 0), 
						direction: (overview?.trends?.transactions || 0) >= 0 ? "up" : "down" 
					}}
					color="gold"
				/>

				<DashboardCard
					title="Reports Generated"
					value={isLoading ? "..." : (overview?.reportsGenerated || 0)}
					subtitle="this month"
					icon={FileText}
					trend={{ 
						value: Math.abs(overview?.trends?.reports || 0), 
						direction: (overview?.trends?.reports || 0) >= 0 ? "up" : "down" 
					}}
					color="blue"
				/>
				<DashboardCard
					title="Completion Rate"
					value={isLoading ? "..." : `${overview?.completionRate || 0}%`}
					subtitle="campaigns completed"
					icon={CheckCircle}
					trend={{ 
						value: Math.abs(overview?.trends?.completionRate || 0), 
						direction: (overview?.trends?.completionRate || 0) >= 0 ? "up" : "down" 
					}}
				/>
				<DashboardCard
					title="Total Revenue for Setu"
					value={isLoading ? "..." : formatCurrency(overview?.setuRevenue || 0)}
					subtitle="from tips"
					icon={DollarSign}
					trend={{ 
						value: Math.abs(overview?.trends?.setuRevenue || 0), 
						direction: (overview?.trends?.setuRevenue || 0) >= 0 ? "up" : "down" 
					}}
					color="gold"
				/>
				<DashboardCard
					title="Goods Donations"
					value={isLoading ? "..." : (overview?.totalGoodsDonations || 0)}
					subtitle={`${overview?.totalGoodsItems || 0} items`}
					icon={Package}
					trend={{ 
						value: Math.abs(overview?.trends?.goodsDonations || 0), 
						direction: (overview?.trends?.goodsDonations || 0) >= 0 ? "up" : "down" 
					}}
				/>
				<DashboardCard
					title="Total Distribution"
					value={isLoading ? "..." : formatCurrency(overview?.totalDistribution || 0)}
					subtitle="to beneficiaries"
					icon={HandGrab}
					trend={{ value: 0, direction: "up" }}
				/>
				<DashboardCard
					title="Operating Cost"
					value={isLoading ? "..." : formatCurrency(overview?.operatingCost || 0)}
					subtitle="overhead expenses"
					icon={Folder}
					color="gold"
				/>
				<DashboardCard
					title="Efficiency Rate"
					value={isLoading ? "..." : `${overview?.efficiencyRate || 0}%`}
					subtitle="of funds distributed"
					icon={CheckCircle}
				/>
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Donations Over Time */}
				<div className="lg:col-span-2 bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-setu-900">
							Monthly Donations Trend
						</h3>
						<p className="text-sm text-setu-500 mt-1">
							Donation amounts and donor count over time
						</p>
					</div>
					{isLoading ? (
						<div className="flex items-center justify-center h-[300px]">
							<div className="w-8 h-8 border-4 border-setu-200 border-t-setu-600 rounded-full animate-spin" />
						</div>
					) : (
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={monthlyTrends}>
								<CartesianGrid strokeDasharray="3 3" stroke="#dcf5e4" />
								<XAxis dataKey="month" stroke="#87d8a6" />
								<YAxis stroke="#87d8a6" />
								<Tooltip
									contentStyle={{
										backgroundColor: "#fefdf8",
										border: "1px solid #bbeacc",
										borderRadius: "8px",
									}}
								/>
								<Legend />
								<Line
									type="monotone"
									dataKey="amount"
									stroke="#2aa558"
									strokeWidth={2}
									dot={{ fill: "#2aa558", r: 5 }}
									activeDot={{ r: 7 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					)}
				</div>

				{/* Campaign Status Distribution */}
				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-setu-900">
							Campaign Status
						</h3>
						<p className="text-sm text-setu-500 mt-1">Distribution by status</p>
					</div>
					{isLoading ? (
						<div className="flex items-center justify-center h-[250px]">
							<div className="w-8 h-8 border-4 border-setu-200 border-t-setu-600 rounded-full animate-spin" />
						</div>
					) : (
						<>
							<ResponsiveContainer width="100%" height={250}>
								<PieChart>
									<Pie
										data={campaignStats?.statusDistribution || []}
										cx="50%"
										cy="50%"
										innerRadius={60}
										outerRadius={90}
										paddingAngle={5}
										dataKey="value">
										{(campaignStats?.statusDistribution || []).map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.fill} />
										))}
									</Pie>
									<Tooltip
										contentStyle={{
											backgroundColor: "#fefdf8",
											border: "1px solid #bbeacc",
											borderRadius: "8px",
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
							<div className="mt-4 space-y-2">
								{(campaignStats?.statusDistribution || []).map((status) => (
									<div
										key={status.name}
										className="flex items-center justify-between text-sm">
										<div className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: status.fill }}
											/>
											<span className="text-setu-700">{status.name}</span>
										</div>
										<span className="font-semibold text-setu-900">
											{status.value}
										</span>
									</div>
								))}
							</div>
						</>
					)}
				</div>
			</div>

			{/* Category Distribution */}
			<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
				<div className="mb-6">
					<h3 className="text-lg font-semibold text-setu-900">
						Category Distribution
					</h3>
					<p className="text-sm text-setu-500 mt-1">
						Campaigns and donors by category
					</p>
				</div>
				{isLoading ? (
					<div className="flex items-center justify-center h-[300px]">
						<div className="w-8 h-8 border-4 border-setu-200 border-t-setu-600 rounded-full animate-spin" />
					</div>
				) : categoryDistribution.length === 0 ? (
					<div className="flex items-center justify-center h-[300px] text-setu-500">
						No category data available
					</div>
				) : (
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={categoryDistribution.map(cat => ({ 
							category: cat._id, 
							campaigns: cat.campaigns, 
							donors: cat.donors 
						}))}>
							<CartesianGrid strokeDasharray="3 3" stroke="#dcf5e4" />
							<XAxis dataKey="category" stroke="#87d8a6" />
							<YAxis stroke="#87d8a6" />
							<Tooltip
								contentStyle={{
									backgroundColor: "#fefdf8",
									border: "1px solid #bbeacc",
									borderRadius: "8px",
								}}
							/>
							<Legend />
							<Bar
								dataKey="campaigns"
								fill="#2aa558"
								radius={[8, 8, 0, 0]}
							/>
							<Bar
								dataKey="donors"
								fill="#87d8a6"
								radius={[8, 8, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</div>

			{/* Recent Activity */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Recent Transactions */}
				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-setu-900">
							Recent Transactions
						</h3>
						<p className="text-sm text-setu-500 mt-1">Latest donations</p>
					</div>
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="w-8 h-8 border-4 border-setu-200 border-t-setu-600 rounded-full animate-spin" />
						</div>
					) : recentTransactions.length === 0 ? (
						<div className="text-center py-8 text-setu-500">
							No recent transactions
						</div>
					) : (
						<div className="space-y-4">
							{recentTransactions.slice(0, 5).map((txn) => (
								<div
									key={txn.id}
									className="flex items-center justify-between p-4 bg-setu-50 rounded-lg border border-setu-100">
									<div className="flex-1">
										<p className="font-medium text-setu-900">{txn.donorName}</p>
										<p className="text-sm text-setu-500">{txn.campaignTitle}</p>
										<p className="text-xs text-setu-400 mt-1">
											{new Date(txn.date).toLocaleDateString()}
										</p>
									</div>
									<div className="text-right">
										<p className="font-semibold text-setu-900">
											₨{txn.amount.toLocaleString()}
										</p>
										<Badge
											variant={
												txn.status === "completed"
													? "success"
													: txn.status === "pending"
														? "pending"
														: "error"
											}
											size="sm">
											{txn.status}
										</Badge>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Quick Stats */}
				<div className="space-y-4">
					<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
						<h3 className="text-lg font-semibold text-setu-900 mb-4">
							Quick Statistics
						</h3>
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<div className="w-8 h-8 border-4 border-setu-200 border-t-setu-600 rounded-full animate-spin" />
							</div>
						) : (
							<div className="space-y-3">
								<StatCard
									label="Average Donation"
									value={quickStats?.averageDonation || 0}
									format="currency"
									icon={<Heart size={18} className="text-red-500" />}
								/>
								<StatCard
									label="Avg Donors per Campaign"
									value={campaignStats?.avgDonorsPerCampaign || 0}
									icon={<Users size={18} className="text-blue-500" />}
								/>
								<StatCard
									label="Funding Progress"
									value={quickStats?.fundingProgress || 0}
									format="percentage"
									max={100}
									icon={<Activity size={18} className="text-setu-500" />}
								/>
							</div>
						)}
					</div>

				</div>
			</div>

			{/* Additional Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Goods Donation Trend */}
				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-setu-900">
							Goods Donation Trend
						</h3>
						<p className="text-sm text-setu-500 mt-1">
							Inventory items and donation frequency
						</p>
					</div>
					{isLoading ? (
						<div className="flex items-center justify-center h-[300px]">
							<div className="w-8 h-8 border-4 border-setu-200 border-t-setu-600 rounded-full animate-spin" />
						</div>
					) : (
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={dashboardData?.goodsMonthlyTrends || []}>
								<CartesianGrid strokeDasharray="3 3" stroke="#dcf5e4" />
								<XAxis dataKey="month" stroke="#87d8a6" />
								<YAxis stroke="#87d8a6" />
								<Tooltip
									contentStyle={{
										backgroundColor: "#fefdf8",
										border: "1px solid #bbeacc",
										borderRadius: "8px",
									}}
								/>
								<Legend />
								<Bar dataKey="count" name="Donations" fill="#2aa558" radius={[4, 4, 0, 0]} />
								<Bar dataKey="items" name="Total Items" fill="#87d8a6" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					)}
				</div>

				{/* Recent Goods Donations */}
				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-setu-900">
							Recent Goods Donations
						</h3>
						<p className="text-sm text-setu-500 mt-1">Latest physical donations</p>
					</div>
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="w-8 h-8 border-4 border-setu-200 border-t-setu-600 rounded-full animate-spin" />
						</div>
					) : (dashboardData?.recentGoodsDonations || []).length === 0 ? (
						<div className="text-center py-8 text-setu-500">
							No recent goods donations
						</div>
					) : (
						<div className="space-y-4">
							{(dashboardData?.recentGoodsDonations || []).slice(0, 5).map((donation) => (
								<div
									key={donation.id}
									className="flex items-center justify-between p-4 bg-setu-50 rounded-lg border border-setu-100">
									<div className="flex-1">
										<p className="font-medium text-setu-900">{donation.donorName}</p>
										<p className="text-sm text-setu-500">{donation.campaignTitle}</p>
										<p className="text-xs text-setu-400 mt-1">
											{new Date(donation.date).toLocaleDateString()}
										</p>
									</div>
									<div className="text-right">
										<p className="font-semibold text-setu-900">
											{donation.items} items
										</p>
										<Badge
											variant={
												donation.status === "completed"
													? "success"
													: donation.status === "pending"
														? "pending"
														: "error"
											}
											size="sm">
											{donation.status}
										</Badge>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
