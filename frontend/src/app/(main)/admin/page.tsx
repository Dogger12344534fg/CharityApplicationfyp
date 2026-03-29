"use client";

import { useMemo } from "react";
import {
	TrendingUp,
	Users,
	AlertCircle,
	DollarSign,
	Heart,
	Activity,
} from "lucide-react";
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
import { mockCampaigns, mockTransactions, mockDonors } from "@/lib/mockData";

// Chart data
const monthlyDonationData = [
	{ month: "Jan", amount: 32000, donors: 45 },
	{ month: "Feb", amount: 45000, donors: 52 },
	{ month: "Mar", amount: 58000, donors: 68 },
	{ month: "Apr", amount: 41000, donors: 55 },
	{ month: "May", amount: 53000, donors: 71 },
	{ month: "Jun", amount: 62000, donors: 82 },
];

const campaignStatusData = [
	{ name: "Active", value: 2, fill: "#2aa558" },
	{ name: "Approved", value: 1, fill: "#87d8a6" },
	{ name: "Completed", value: 1, fill: "#1e8745" },
	{ name: "Rejected", value: 1, fill: "#d4a017" },
];

const categoryDistribution = [
	{ category: "Health", campaigns: 15, donors: 342 },
	{ category: "Shelter", campaigns: 7, donors: 156 },
	{ category: "Food", campaigns: 12, donors: 298 },
	{ category: "Education", campaigns: 8, donors: 187 },
];

export default function DashboardPage() {
	const stats = useMemo(() => {
		const totalDonated = mockTransactions
			.filter((t) => t.status === "completed")
			.reduce((sum, t) => sum + t.amount, 0);

		const activeCampaigns = mockCampaigns.filter(
			(c) => c.status === "active" || c.status === "approved",
		).length;

		const totalDonors = mockDonors.length;
		const completedTransactions = mockTransactions.filter(
			(t) => t.status === "completed",
		).length;

		return {
			totalDonated,
			activeCampaigns,
			totalDonors,
			completedTransactions,
		};
	}, []);

	const recentTransactions = mockTransactions.slice(0, 5);

	return (
		<div className="space-y-8 animate-fade-in-up">
			{/* Key Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<DashboardCard
					title="Total Donations"
					value={`₨${(stats.totalDonated / 1000).toFixed(0)}k`}
					icon={DollarSign}
					trend={{ value: 12, direction: "up" }}
					color="setu"
				/>
				<DashboardCard
					title="Active Campaigns"
					value={stats.activeCampaigns}
					icon={AlertCircle}
					trend={{ value: 5, direction: "up" }}
					color="green"
				/>
				<DashboardCard
					title="Total Donors"
					value={stats.totalDonors}
					icon={Users}
					trend={{ value: 8, direction: "up" }}
					color="blue"
				/>
				<DashboardCard
					title="Completed Transactions"
					value={stats.completedTransactions}
					icon={TrendingUp}
					trend={{ value: 3, direction: "down" }}
					color="gold"
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
					<ResponsiveContainer
						width="100%"
						height={300}>
						<LineChart data={monthlyDonationData}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#dcf5e4"
							/>
							<XAxis
								dataKey="month"
								stroke="#87d8a6"
							/>
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
				</div>

				{/* Campaign Status Distribution */}
				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-setu-900">
							Campaign Status
						</h3>
						<p className="text-sm text-setu-500 mt-1">Distribution by status</p>
					</div>
					<ResponsiveContainer
						width="100%"
						height={250}>
						<PieChart>
							<Pie
								data={campaignStatusData}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={90}
								paddingAngle={5}
								dataKey="value">
								{campaignStatusData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={entry.fill}
									/>
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
						{campaignStatusData.map((status) => (
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
				<ResponsiveContainer
					width="100%"
					height={300}>
					<BarChart data={categoryDistribution}>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#dcf5e4"
						/>
						<XAxis
							dataKey="category"
							stroke="#87d8a6"
						/>
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
					<div className="space-y-4">
						{recentTransactions.map((txn) => (
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
				</div>

				{/* Quick Stats */}
				<div className="space-y-4">
					<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
						<h3 className="text-lg font-semibold text-setu-900 mb-4">
							Quick Statistics
						</h3>
						<div className="space-y-3">
							<StatCard
								label="Average Donation"
								value={
									stats.completedTransactions > 0
										? Math.round(
												stats.totalDonated / stats.completedTransactions,
											)
										: 0
								}
								format="currency"
								icon={
									<Heart
										size={18}
										className="text-red-500"
									/>
								}
							/>
							<StatCard
								label="Avg Donors per Campaign"
								value={
									mockCampaigns.length > 0
										? Math.round(
												mockCampaigns.reduce(
													(sum, c) => sum + c.donorCount,
													0,
												) / mockCampaigns.length,
											)
										: 0
								}
								icon={
									<Users
										size={18}
										className="text-blue-500"
									/>
								}
							/>
							<StatCard
								label="Funding Progress"
								value={
									mockCampaigns.length > 0
										? Math.round(
												(mockCampaigns.reduce(
													(sum, c) => sum + c.fundedAmount,
													0,
												) /
													mockCampaigns.reduce(
														(sum, c) => sum + c.targetAmount,
														0,
													)) *
													100,
											)
										: 0
								}
								format="percentage"
								max={100}
								icon={
									<Activity
										size={18}
										className="text-setu-500"
									/>
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
