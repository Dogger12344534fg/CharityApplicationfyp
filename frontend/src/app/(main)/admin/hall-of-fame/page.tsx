"use client";

import { useState } from "react";
import { Star, DollarSign, CheckCircle, Activity } from "lucide-react";
import { mockHallOfFame } from "@/lib/mockData";
import { DashboardCard } from "@/src/components/dashboard/DashboardCard";
import { Badge } from "@/src/components/dashboard/Badge";
import { ActionButton } from "@/src/components/dashboard/ActionButton";
import { Modal } from "@/src/components/dashboard/Modal";

interface HallOfFameRow {
	id: string;
	name: string;
	title: string;
	contributionAmount: number;
	contributionCount: number;
	impact: string;
	category: string;
	isVerified: boolean;
	joinedDate: string;
}

export default function HallOfFamePage() {
	const [selectedEntry, setSelectedEntry] = useState<HallOfFameRow | null>(
		null,
	);
	const [showModal, setShowModal] = useState(false);
	const [filterCategory, setFilterCategory] = useState("all");
	const [sortBy, setSortBy] = useState<"amount" | "impact" | "date">("amount");

	const hallOfFameRows: HallOfFameRow[] = mockHallOfFame.map((entry) => ({
		id: entry.id,
		name: entry.name,
		title: entry.title,
		contributionAmount: entry.contributionAmount,
		contributionCount: entry.contributionCount,
		impact: entry.impact,
		category: entry.category,
		isVerified: entry.isVerified,
		joinedDate: new Date(entry.joinedDate).toLocaleDateString(),
	}));

	const filteredEntries = hallOfFameRows
		.filter(
			(entry) => filterCategory === "all" || entry.category === filterCategory,
		)
		.sort((a, b) => {
			if (sortBy === "amount")
				return b.contributionAmount - a.contributionAmount;
			if (sortBy === "impact") return b.contributionCount - a.contributionCount;
			if (sortBy === "date")
				return (
					new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
				);
			return 0;
		});

	const categories = [...new Set(hallOfFameRows.map((e) => e.category))];
	const topContributor = hallOfFameRows[0];
	const totalContributions = hallOfFameRows.reduce(
		(sum, e) => sum + e.contributionAmount,
		0,
	);
	const activeCount = hallOfFameRows.filter(
		(e) => e.contributionCount > 0,
	).length;

	const handleView = (entry: HallOfFameRow) => {
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
					title="Top Contributors"
					value={hallOfFameRows.length}
					subtitle="donors featured"
					icon={Star}
					color="gold"
					trend={{ value: 3, direction: "up" }}
				/>
				<DashboardCard
					title="Total Contributions"
					value="₨25.5M"
					subtitle="cumulative donations"
					icon={DollarSign}
					color="gold"
					trend={{ value: 15, direction: "up" }}
				/>
				<DashboardCard
					title="Active Contributors"
					value={activeCount}
					subtitle="still donating"
					icon={Activity}
					color="gold"
					trend={{ value: 8, direction: "up" }}
				/>
				<DashboardCard
					title="Total Contributions"
					value={`$${(totalContributions / 1000000).toFixed(1)}M`}
					subtitle="aggregate support"
					variant="green"
					icon={DollarSign}
				/>
				<DashboardCard
					title="Verified Entries"
					value={hallOfFameRows.filter((e) => e.isVerified).length}
					subtitle="verified donors"
					variant="green"
					icon={CheckCircle}
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
							<p className="text-setu-100 mb-4">{topContributor.title}</p>
							<div className="flex items-center gap-4">
								<div>
									<p className="text-sm text-setu-100">Total Contributions</p>
									<p className="text-2xl font-bold">
										${(topContributor.contributionAmount / 1000000).toFixed(1)}M
									</p>
								</div>
								<div>
									<p className="text-sm text-setu-100">Impact Score</p>
									<p className="text-2xl font-bold">
										{topContributor.contributionCount}+
									</p>
								</div>
							</div>
						</div>
						<div className="text-8xl opacity-20">⭐</div>
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
										{index === 0 && <span className="text-2xl">🥇</span>}
										{index === 1 && <span className="text-2xl">🥈</span>}
										{index === 2 && <span className="text-2xl">🥉</span>}
										{index > 2 && <span className="text-lg">⭐</span>}
									</div>
									<h3 className="text-lg font-bold text-setu-950">
										{entry.name}
									</h3>
									<p className="text-sm text-setu-600">{entry.title}</p>
								</div>
								{entry.isVerified && (
									<Badge
										variant="success"
										className="text-xs">
										✓ Verified
									</Badge>
								)}
							</div>

							<div className="space-y-3 mb-4">
								<div className="bg-setu-50 p-3 rounded-lg">
									<p className="text-xs text-setu-600 mb-1">
										Total Contribution
									</p>
									<p className="text-xl font-bold text-setu-700">
										${(entry.contributionAmount / 1000000).toFixed(1)}M
									</p>
								</div>
								<div className="bg-setu-50 p-3 rounded-lg">
									<p className="text-xs text-setu-600 mb-1">Impact Score</p>
									<p className="text-xl font-bold text-setu-700">
										{entry.contributionCount} lives helped
									</p>
								</div>
							</div>

							<div className="mb-4">
								<p className="text-xs text-setu-600 mb-2">Category</p>
								<Badge
									variant="secondary"
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
						<div className="text-center">
							<p className="text-5xl mb-4">⭐</p>
							<h2 className="text-2xl font-bold font-display text-setu-950 mb-1">
								{selectedEntry.name}
							</h2>
							<p className="text-setu-600">{selectedEntry.title}</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="bg-setu-50 p-4 rounded-lg text-center">
								<p className="text-xs text-setu-600 mb-2">Total Contribution</p>
								<p className="text-2xl font-bold text-setu-700">
									${(selectedEntry.contributionAmount / 1000000).toFixed(1)}M
								</p>
							</div>
							<div className="bg-setu-50 p-4 rounded-lg text-center">
								<p className="text-xs text-setu-600 mb-2">Impact Score</p>
								<p className="text-2xl font-bold text-setu-700">
									{selectedEntry.contributionCount}
								</p>
							</div>
						</div>

						<div>
							<p className="text-sm font-semibold text-setu-900 mb-2">
								Category
							</p>
							<Badge variant="secondary">{selectedEntry.category}</Badge>
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
								Joined {selectedEntry.joinedDate}
							</p>
							{selectedEntry.isVerified && (
								<Badge variant="success">Verified Donor</Badge>
							)}
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
