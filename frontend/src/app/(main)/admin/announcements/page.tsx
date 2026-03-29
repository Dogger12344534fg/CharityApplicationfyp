"use client";

import { useState } from "react";
import { Megaphone, CheckCircle, Edit2, Eye, Box } from "lucide-react";
import { mockAnnouncements, AnnouncementRow } from "@/lib/mockData";
import { DashboardCard } from "@/src/components/dashboard/DashboardCard";
import { Badge } from "@/src/components/dashboard/Badge";
import { Modal } from "@/src/components/dashboard/Modal";

export default function AnnouncementsPage() {
	const [selectedAnnouncement, setSelectedAnnouncement] =
		useState<AnnouncementRow | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState<
		"all" | "draft" | "published" | "archived"
	>("all");
	const [filterPriority, setFilterPriority] = useState<
		"all" | "high" | "medium" | "low"
	>("all");
	const [sortBy, setSortBy] = useState<"recent" | "views" | "priority">(
		"recent",
	);

	// Prepare announcement data
	const announcementRows: AnnouncementRow[] = mockAnnouncements.map((ann) => ({
		...ann,
		views: ann.views || 0,
		createdAt: new Date(ann.createdAt).toLocaleDateString(),
		publishedAt: ann.publishedAt
			? new Date(ann.publishedAt).toLocaleDateString()
			: undefined,
	}));

	// Filtering & sorting
	const filteredAnnouncements = announcementRows
		.filter((ann) => {
			const matchesSearch =
				ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				ann.content.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus =
				filterStatus === "all" || ann.status === filterStatus;
			const matchesPriority =
				filterPriority === "all" || ann.priority === filterPriority;
			return matchesSearch && matchesStatus && matchesPriority;
		})
		.sort((a, b) => {
			if (sortBy === "recent")
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			if (sortBy === "views") return b.views - a.views;
			if (sortBy === "priority") {
				const priorityOrder = { high: 0, medium: 1, low: 2 };
				return priorityOrder[a.priority] - priorityOrder[b.priority];
			}
			return 0;
		});

	// Handlers
	const handleView = (ann: AnnouncementRow) => {
		setSelectedAnnouncement(ann);
		setShowModal(true);
	};

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this announcement?")) {
			console.log("Deleted announcement:", id);
		}
	};

	const handlePublish = (id: string) => {
		console.log("Published announcement:", id);
	};

	// Stats
	const publishedCount = announcementRows.filter(
		(a) => a.status === "published",
	).length;
	const draftCount = announcementRows.filter(
		(a) => a.status === "draft",
	).length;
	const archivedCount = announcementRows.filter(
		(a) => a.status === "archived",
	).length;
	const totalViews = announcementRows.reduce((sum, a) => sum + a.views, 0);

	return (
		<div className="space-y-8 pb-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold font-display text-setu-950 mb-2">
						Announcements
					</h1>
					<p className="text-setu-600">
						Manage and broadcast announcements to the community
					</p>
				</div>
				<button
					onClick={() => setShowCreateModal(true)}
					className="px-6 py-3 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
					+ New Announcement
				</button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<DashboardCard
					title="Total Announcements"
					value={announcementRows.length}
					subtitle="all time"
					icon={Megaphone}
				/>
				<DashboardCard
					title="Published"
					value={publishedCount}
					subtitle="active"
					icon={CheckCircle}
				/>
				<DashboardCard
					title="Drafts"
					value={draftCount}
					subtitle="pending"
					icon={Edit2}
				/>
				<DashboardCard
					title="Archived"
					value={archivedCount}
					subtitle="archived"
					icon={Box}
				/>
				<DashboardCard
					title="Total Views"
					value={totalViews.toLocaleString()}
					subtitle="audience reached"
					icon={Eye}
				/>
			</div>

			{/* Filters */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-semibold text-setu-900 mb-2">
						Search
					</label>
					<input
						type="text"
						placeholder="Search announcements..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
					/>
				</div>
				<div className="grid grid-cols-3 gap-2">
					<div>
						<label className="block text-sm font-semibold text-setu-900 mb-2">
							Status
						</label>
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value as any)}
							className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu text-sm">
							<option value="all">All Status</option>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
							<option value="archived">Archived</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-semibold text-setu-900 mb-2">
							Priority
						</label>
						<select
							value={filterPriority}
							onChange={(e) => setFilterPriority(e.target.value as any)}
							className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu text-sm">
							<option value="all">All Priority</option>
							<option value="high">High</option>
							<option value="medium">Medium</option>
							<option value="low">Low</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-semibold text-setu-900 mb-2">
							Sort By
						</label>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as any)}
							className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu text-sm">
							<option value="recent">Most Recent</option>
							<option value="views">Most Views</option>
							<option value="priority">Priority</option>
						</select>
					</div>
				</div>
			</div>

			{/* Announcements List */}
			<div className="space-y-4">
				{filteredAnnouncements.length > 0 ? (
					filteredAnnouncements.map((announcement) => (
						<div
							key={announcement.id}
							className="bg-white border border-setu-200 rounded-xl p-6 card-lift hover:shadow-md transition-all">
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<h3 className="text-lg font-bold text-setu-950">
											{announcement.title}
										</h3>
										<Badge
											variant={
												announcement.priority === "high"
													? "secondary"
													: announcement.priority === "medium"
														? "default"
														: "success"
											}
											className="text-xs">
											{announcement.priority === "high"
												? "🔴"
												: announcement.priority === "medium"
													? "🟡"
													: "🟢"}{" "}
											{announcement.priority.charAt(0).toUpperCase() +
												announcement.priority.slice(1)}
										</Badge>
									</div>
									<p className="text-sm text-setu-600 mb-3">
										{announcement.category}
									</p>
								</div>
								<div className="flex gap-2">
									<Badge
										variant={
											announcement.status === "published"
												? "success"
												: announcement.status === "draft"
													? "warning"
													: "secondary"
										}>
										{announcement.status.charAt(0).toUpperCase() +
											announcement.status.slice(1)}
									</Badge>
								</div>
							</div>
							<p className="text-setu-700 mb-4 leading-relaxed line-clamp-2">
								{announcement.content}
							</p>
							<div className="flex items-center justify-between pt-4 border-t border-setu-200">
								<div className="flex items-center gap-4 text-sm text-setu-600">
									<span>Created {announcement.createdAt}</span>
									<span className="flex items-center gap-1">
										👁️ {announcement.views.toLocaleString()} views
									</span>
								</div>
								<div className="flex gap-2">
									{announcement.status === "draft" && (
										<button
											onClick={() => handlePublish(announcement.id)}
											className="px-3 py-1 bg-setu-100 text-setu-700 rounded-lg text-sm font-semibold hover:bg-setu-200 transition-colors">
											Publish
										</button>
									)}
									<button
										onClick={() => handleView(announcement)}
										className="px-3 py-1 bg-white border border-setu-300 text-setu-700 rounded-lg text-sm font-semibold hover:bg-setu-50 transition-colors">
										View
									</button>
									<button
										onClick={() => handleDelete(announcement.id)}
										className="px-3 py-1 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
										Delete
									</button>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="bg-white border border-setu-200 rounded-xl p-12 text-center">
						<p className="text-setu-600 text-lg">No announcements found</p>
					</div>
				)}
			</div>

			{/* View Announcement Modal */}
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setSelectedAnnouncement(null);
				}}
				title={selectedAnnouncement?.title || "Announcement"}>
				{selectedAnnouncement && (
					<div className="space-y-4">
						<div className="flex gap-2">
							<Badge
								variant={
									selectedAnnouncement.priority === "high"
										? "secondary"
										: selectedAnnouncement.priority === "medium"
											? "default"
											: "success"
								}>
								{selectedAnnouncement.priority}
							</Badge>
							<Badge
								variant={
									selectedAnnouncement.status === "published"
										? "success"
										: selectedAnnouncement.status === "draft"
											? "warning"
											: "secondary"
								}>
								{selectedAnnouncement.status}
							</Badge>
						</div>
						<div>
							<p className="text-xs text-setu-600 mb-1">Category</p>
							<p className="font-semibold text-setu-950">
								{selectedAnnouncement.category}
							</p>
						</div>
						<div>
							<p className="text-xs text-setu-600 mb-2">Content</p>
							<p className="text-setu-700 leading-relaxed bg-setu-50 p-4 rounded-lg">
								{selectedAnnouncement.content}
							</p>
						</div>
						<div className="grid grid-cols-3 gap-4">
							<div className="bg-setu-50 p-3 rounded-lg">
								<p className="text-xs text-setu-600 mb-1">Created</p>
								<p className="font-semibold text-setu-700 text-sm">
									{selectedAnnouncement.createdAt}
								</p>
							</div>
							<div className="bg-setu-50 p-3 rounded-lg">
								<p className="text-xs text-setu-600 mb-1">Views</p>
								<p className="font-semibold text-setu-700 text-sm">
									{selectedAnnouncement.views.toLocaleString()}
								</p>
							</div>
							<div className="bg-setu-50 p-3 rounded-lg">
								<p className="text-xs text-setu-600 mb-1">Status</p>
								<p className="font-semibold text-setu-700 text-sm">
									{selectedAnnouncement.status}
								</p>
							</div>
						</div>
						<div className="flex gap-3 justify-end pt-4 border-t border-setu-200 mt-4">
							<button
								onClick={() => setShowModal(false)}
								className="px-4 py-2 border border-setu-300 text-setu-700 rounded-lg font-semibold hover:bg-setu-50 transition-colors">
								Close
							</button>
							{selectedAnnouncement.status === "draft" && (
								<button
									onClick={() => {
										handlePublish(selectedAnnouncement.id);
										setShowModal(false);
									}}
									className="px-4 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
									Publish Now
								</button>
							)}
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
