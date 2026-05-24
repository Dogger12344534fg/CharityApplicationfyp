"use client";

import { useState } from "react";
import {
	Star,
	DollarSign,
	CheckCircle,
	Activity,
	Trophy,
	Medal,
	Award,
} from "lucide-react";
import { DashboardCard } from "@/src/components/dashboard/DashboardCard";
import { Badge } from "@/src/components/dashboard/Badge";
import { ActionButton } from "@/src/components/dashboard/ActionButton";
import { Modal } from "@/src/components/dashboard/Modal";
import { useGetLeaderboard, HallOfFameDonor } from "@/src/hooks/useHallOfFame";
import { useGetDonorStatsAdmin } from "@/src/hooks/useUser";

export default function HallOfFamePage() {
	const [selectedEntry, setSelectedEntry] = useState<HallOfFameDonor | null>(
		null,
	);
	const [showModal, setShowModal] = useState(false);
	const [filterCategory, setFilterCategory] = useState("all");
	const [sortBy, setSortBy] = useState<"amount" | "impact" | "date">("amount");

	const { data, isLoading } = useGetLeaderboard({ donorLimit: 50 });
	const backendDonors = data?.donors || [];

	const { data: statsRaw } = useGetDonorStatsAdmin();
	const stats = statsRaw?.data || {
		totalDonors: 0,
		totalDonated: 0,
		totalDonations: 0,
	};

	const getTitle = (badge: string | null) =>
		badge
			? `${badge.charAt(0).toUpperCase() + badge.slice(1)} Contributor`
			: "Supporter";

	const filteredEntries = backendDonors
		.filter(
			(entry) => filterCategory === "all" || entry.category === filterCategory,
		)
		.sort((a, b) => {
			if (sortBy === "amount") return b.totalDonated - a.totalDonated;
			if (sortBy === "impact") return b.donationsCount - a.donationsCount;
			if (sortBy === "date")
				return (
					new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
				);
			return 0;
		});

	const categories = [...new Set(backendDonors.map((e) => e.category))];
	const topContributor = backendDonors[0];
	const totalContributions = backendDonors.reduce(
		(sum, e) => sum + e.totalDonated,
		0,
	);
	const activeCount = backendDonors.filter((e) => e.donationsCount > 0).length;

	const handleView = (entry: HallOfFameDonor) => {
		setSelectedEntry(entry);
		setShowModal(true);
	};

	return (
		<div className="space-y-8 pb-8">
			{/* Page Header */}
			<div>
				<h1 className="text-4xl font-bold font-display text-setu-950 mb-2">
					Hall of Fame
				</h1>
				<p className="text-setu-600">
					Celebrate our most generous donors and contributors
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<DashboardCard
					title="Platform Donors"
					value={stats.totalDonors}
					subtitle="registered donors"
					icon={Star}
					color="gold"
				/>
				<DashboardCard
					title="Total Contributions"
					value={`₨${(stats.totalDonated / 1000).toFixed(1)}k`}
					subtitle="cumulative donations"
					icon={DollarSign}
					color="green"
				/>
				<DashboardCard
					title="Total Donations"
					value={stats.totalDonations}
					subtitle="completed transactions"
					icon={CheckCircle}
					color="gold"
				/>
			</div>

			{/* Top Contributor Spotlight */}
			{topContributor && (
				<div className="bg-gradient-to-r from-setu-600 to-setu-700 text-white rounded-xl p-8 card-lift shadow-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-semibold text-setu-100 mb-2">
								TOP CONTRIBUTOR
							</p>
							<h2 className="text-3xl font-bold font-display mb-2">
								{topContributor.name}
							</h2>
							<p className="text-setu-100 mb-4">
								{getTitle(topContributor.badge)}
							</p>
							<div className="flex items-center gap-4">
								<div>
									<p className="text-sm text-setu-100">Total Contributions</p>
									<p className="text-2xl font-bold">
										Rs {topContributor.totalDonated}
									</p>
								</div>
								<div>
									<p className="text-sm text-setu-100">Donations Made</p>
									<p className="text-2xl font-bold">
										{topContributor.donationsCount}
									</p>
								</div>
							</div>
						</div>
						<div className="text-white opacity-20">
							<Trophy size={100} />
						</div>
					</div>
				</div>
			)}

			{/* Filters */}
			<div className="flex gap-4 flex-wrap">
				<div className="flex-1 min-w-fit">
					<label className="block text-sm font-semibold text-setu-900 mb-2">
						Category
					</label>
					<select
						value={filterCategory}
						onChange={(e) => setFilterCategory(e.target.value)}
						className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu">
						<option value="all">All Categories</option>
						{categories.map((cat, idx) => (
							<option
								key={`${cat}-$`}
								value={cat}>
								{cat}
							</option>
						))}
					</select>
				</div>
				<div className="flex-1 min-w-fit">
					<label className="block text-sm font-semibold text-setu-900 mb-2">
						Sort By
					</label>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as any)}
						className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu">
						<option value="amount">Highest Contribution</option>
						<option value="impact">Most Impact</option>
						<option value="date">Recently Joined</option>
					</select>
				</div>
			</div>

			{/* Hall of Fame Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredEntries.length > 0 ? (
					filteredEntries.map((entry, index) => (
						<div
							key={entry.id}
							className="bg-white border border-setu-200 rounded-xl p-6 card-lift hover:shadow-lg transition-all">
							<div className="flex items-start justify-between mb-4">
								<div>
									<div className="flex items-center gap-2 mb-2">
										{index === 0 && (
											<Trophy
												className="text-yellow-500"
												size={24}
											/>
										)}
										{index === 1 && (
											<Medal
												className="text-gray-400"
												size={24}
											/>
										)}
										{index === 2 && (
											<Medal
												className="text-amber-600"
												size={24}
											/>
										)}
										{index > 2 && (
											<Award
												className="text-setu-400"
												size={20}
											/>
										)}
									</div>
									<h3 className="text-lg font-bold text-setu-950">
										{entry.name}
									</h3>
									<p className="text-sm text-setu-600">
										{getTitle(entry.badge)}
									</p>
								</div>
								<Badge
									variant="success"
									className="text-xs">
									✓ Verified
								</Badge>
							</div>

							<div className="space-y-3 mb-4">
								<div className="bg-setu-50 p-3 rounded-lg">
									<p className="text-xs text-setu-600 mb-1">
										Total Contribution
									</p>
									<p className="text-xl font-bold text-setu-700">
										₨{(entry.totalDonated / 1000).toFixed(1)}k
									</p>
								</div>
								<div className="bg-setu-50 p-3 rounded-lg">
									<p className="text-xs text-setu-600 mb-1">Impact Score</p>
									<p className="text-xl font-bold text-setu-700">
										{entry.campaignsSupported} campaigns
									</p>
								</div>
							</div>

							<div className="mb-4">
								<p className="text-xs text-setu-600 mb-2">Category</p>
								<Badge
									variant="info"
									className="text-xs">
									{entry.category}
								</Badge>
							</div>

							<p className="text-sm text-setu-600 mb-4 leading-relaxed">
								{entry.impact}
							</p>

							<div className="flex gap-2">
								<button
									onClick={() => handleView(entry)}
									className="flex-1 px-4 py-2 bg-setu-100 text-setu-700 rounded-lg font-semibold hover:bg-setu-200 transition-colors text-sm">
									View Profile
								</button>
							</div>
						</div>
					))
				) : (
					<div className="col-span-full text-center py-12">
						<p className="text-setu-600 text-lg">
							No entries found in this category
						</p>
					</div>
				)}
			</div>

			{/* Profile Modal */}
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setSelectedEntry(null);
				}}
				title={selectedEntry?.name || "Profile"}>
				{selectedEntry && (
					<div className="space-y-6">
						<div className="text-center flex flex-col items-center">
							<div className="mb-4 text-yellow-500">
								<Award size={48} />
							</div>
							<h2 className="text-2xl font-bold font-display text-setu-950 mb-1">
								{selectedEntry.name}
							</h2>
							<p className="text-setu-600">{getTitle(selectedEntry.badge)}</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="bg-setu-50 p-4 rounded-lg text-center">
								<p className="text-xs text-setu-600 mb-2">Total Contribution</p>
								<p className="text-2xl font-bold text-setu-700">
									₨{(selectedEntry.totalDonated / 1000).toFixed(1)}k
								</p>
							</div>
							<div className="bg-setu-50 p-4 rounded-lg text-center">
								<p className="text-xs text-setu-600 mb-2">
									Campaigns Supported
								</p>
								<p className="text-2xl font-bold text-setu-700">
									{selectedEntry.campaignsSupported}
								</p>
							</div>
						</div>

						<div>
							<p className="text-sm font-semibold text-setu-900 mb-2">
								Category
							</p>
							<Badge variant="info">{selectedEntry.category}</Badge>
						</div>

						<div>
							<p className="text-sm font-semibold text-setu-900 mb-2">
								Impact Statement
							</p>
							<p className="text-setu-600 leading-relaxed">
								{selectedEntry.impact}
							</p>
						</div>

						<div className="flex items-center justify-between pt-4 border-t border-setu-200">
							<p className="text-sm text-setu-600">
								Joined{" "}
								{selectedEntry.joinedDate
									? new Date(selectedEntry.joinedDate).toLocaleDateString()
									: "N/A"}
							</p>
							<Badge variant="success">Verified Donor</Badge>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
