"use client";

import { useState } from "react";
import {
	DollarSign,
	Users,
	FileText,
	CheckCircle,
	HandGrab,
	Folder,
} from "lucide-react";
import { DashboardCard } from "@/src/components/dashboard/DashboardCard";
import { Badge } from "@/src/components/dashboard/Badge";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";

const monthlyData = [
	{ month: "Jan", collections: 250000, distribution: 180000, overhead: 40000 },
	{ month: "Feb", collections: 320000, distribution: 210000, overhead: 45000 },
	{ month: "Mar", collections: 280000, distribution: 195000, overhead: 42000 },
	{ month: "Apr", collections: 380000, distribution: 250000, overhead: 50000 },
	{ month: "May", collections: 450000, distribution: 320000, overhead: 55000 },
	{ month: "Jun", collections: 520000, distribution: 380000, overhead: 60000 },
];

const categoryBreakdown = [
	{ name: "Food & Water", value: 35, color: "#2aa558" },
	{ name: "Medical Supplies", value: 25, color: "#1e8745" },
	{ name: "Shelter", value: 20, color: "#87d8a6" },
	{ name: "Other", value: 20, color: "#bbeacc" },
];

const regionImpact = [
	{ region: "Region A", beneficiaries: 2400, campaigns: 5 },
	{ region: "Region B", beneficiaries: 1800, campaigns: 4 },
	{ region: "Region C", beneficiaries: 2100, campaigns: 5 },
	{ region: "Region D", beneficiaries: 1600, campaigns: 3 },
	{ region: "Region E", beneficiaries: 2000, campaigns: 4 },
];

export default function ReportsPage() {
	const [dateRange, setDateRange] = useState<"month" | "quarter" | "year">(
		"month",
	);
	const [selectedMetric, setSelectedMetric] = useState<
		"all" | "collections" | "distribution"
	>("all");

	const totalCollections = monthlyData.reduce(
		(sum, m) => sum + m.collections,
		0,
	);
	const totalDistribution = monthlyData.reduce(
		(sum, m) => sum + m.distribution,
		0,
	);
	const totalOverhead = monthlyData.reduce((sum, m) => sum + m.overhead, 0);
	const efficiencyRate = ((totalDistribution / totalCollections) * 100).toFixed(
		1,
	);

	return (
		<div className="space-y-8 pb-8">
			{/* Page Header */}
			<div>
				<h1 className="text-4xl font-bold font-display text-setu-950 mb-2">
					Reports & Analytics
				</h1>
				<p className="text-setu-600">
					Comprehensive insights on collections, distribution, and impact
				</p>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<DashboardCard
					title="Total Collections"
					value="₨125.5M"
					subtitle="raised this year"
					icon={DollarSign}
					trend={{ value: 12, direction: "up" }}
				/>
				<DashboardCard
					title="Beneficiaries"
					value="45,230"
					subtitle="people helped"
					icon={Users}
					trend={{ value: 18, direction: "up" }}
				/>
				<DashboardCard
					title="Reports Generated"
					value="156"
					subtitle="this month"
					icon={FileText}
					trend={{ value: 22, direction: "up" }}
				/>
				<DashboardCard
					title="Completion Rate"
					value="92%"
					subtitle="campaigns completed"
					icon={CheckCircle}
					trend={{ value: 5, direction: "up" }}
				/>
				<DashboardCard
					title="Total Distribution"
					value={`$${(totalDistribution / 1000000).toFixed(1)}M`}
					subtitle="to beneficiaries"
					variant="green"
					icon={HandGrab}
					trend={12}
				/>
				<DashboardCard
					title="Operating Cost"
					value={`$${(totalOverhead / 1000000).toFixed(2)}M`}
					subtitle="overhead expenses"
					variant="green"
					icon={Folder}
				/>
				<DashboardCard
					title="Efficiency Rate"
					value={`${efficiencyRate}%`}
					subtitle="of funds distributed"
					variant="green"
					icon={CheckCircle}
				/>
			</div>

			{/* Date Range Selector */}
			<div className="flex gap-4">
				{(["month", "quarter", "year"] as const).map((range) => (
					<button
						key={range}
						onClick={() => setDateRange(range)}
						className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
							dateRange === range
								? "bg-setu-600 text-white"
								: "bg-white border border-setu-200 text-setu-700 hover:border-setu-400"
						}`}>
						{range === "month"
							? "This Month"
							: range === "quarter"
								? "This Quarter"
								: "This Year"}
					</button>
				))}
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Monthly Trend Chart */}
				<div className="bg-white border border-setu-200 rounded-xl p-6 card-lift">
					<h3 className="text-lg font-bold text-setu-950 mb-4">
						Monthly Trend
					</h3>
					<ResponsiveContainer
						width="100%"
						height={300}>
						<LineChart data={monthlyData}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#bbeacc"
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
								dataKey="collections"
								stroke="#2aa558"
								strokeWidth={2}
								dot={{ r: 4 }}
							/>
							<Line
								type="monotone"
								dataKey="distribution"
								stroke="#1e8745"
								strokeWidth={2}
								dot={{ r: 4 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				{/* Collections vs Distribution */}
				<div className="bg-white border border-setu-200 rounded-xl p-6 card-lift">
					<h3 className="text-lg font-bold text-setu-950 mb-4">
						Collections vs Distribution
					</h3>
					<ResponsiveContainer
						width="100%"
						height={300}>
						<BarChart data={monthlyData}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#bbeacc"
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
							<Bar
								dataKey="collections"
								fill="#2aa558"
								radius={[8, 8, 0, 0]}
							/>
							<Bar
								dataKey="distribution"
								fill="#87d8a6"
								radius={[8, 8, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Category Breakdown */}
				<div className="bg-white border border-setu-200 rounded-xl p-6 card-lift">
					<h3 className="text-lg font-bold text-setu-950 mb-4">
						Aid Distribution by Category
					</h3>
					<ResponsiveContainer
						width="100%"
						height={300}>
						<PieChart>
							<Pie
								data={categoryBreakdown}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, value }) => `${name} (${value}%)`}
								outerRadius={80}
								fill="#2aa558"
								dataKey="value">
								{categoryBreakdown.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={entry.color}
									/>
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Regional Impact */}
				<div className="bg-white border border-setu-200 rounded-xl p-6 card-lift">
					<h3 className="text-lg font-bold text-setu-950 mb-4">
						Regional Impact
					</h3>
					<ResponsiveContainer
						width="100%"
						height={300}>
						<BarChart data={regionImpact}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#bbeacc"
							/>
							<XAxis
								dataKey="region"
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
								dataKey="beneficiaries"
								fill="#2aa558"
								radius={[8, 8, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Report Summary Cards */}
			<div className="space-y-4">
				<h3 className="text-xl font-bold text-setu-950">Report Summary</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-white border border-setu-200 rounded-xl p-6 card-lift">
						<p className="text-sm text-setu-600 mb-2">
							Average Monthly Collection
						</p>
						<p className="text-2xl font-bold text-setu-700">
							${(totalCollections / monthlyData.length / 1000000).toFixed(2)}M
						</p>
					</div>
					<div className="bg-white border border-setu-200 rounded-xl p-6 card-lift">
						<p className="text-sm text-setu-600 mb-2">
							Average Monthly Distribution
						</p>
						<p className="text-2xl font-bold text-setu-700">
							${(totalDistribution / monthlyData.length / 1000000).toFixed(2)}M
						</p>
					</div>
					<div className="bg-white border border-setu-200 rounded-xl p-6 card-lift">
						<p className="text-sm text-setu-600 mb-2">
							Total Beneficiaries Served
						</p>
						<p className="text-2xl font-bold text-setu-700">
							{regionImpact
								.reduce((sum, r) => sum + r.beneficiaries, 0)
								.toLocaleString()}
						</p>
					</div>
				</div>
			</div>

			{/* Export Section */}
			<div className="bg-setu-50 border border-setu-200 rounded-xl p-6 flex items-center justify-between">
				<div>
					<h3 className="font-bold text-setu-950 mb-1">Export Reports</h3>
					<p className="text-sm text-setu-600">
						Download detailed reports for further analysis
					</p>
				</div>
				<div className="flex gap-3">
					<button className="px-4 py-2 bg-white border border-setu-300 text-setu-700 rounded-lg font-semibold hover:bg-setu-50 transition-colors">
						Download PDF
					</button>
					<button className="px-4 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
						Export CSV
					</button>
				</div>
			</div>
		</div>
	);
}
