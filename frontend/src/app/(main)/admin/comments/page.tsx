"use client";

import { useState } from "react";
import { MessageSquare, Clock, CheckCircle, ThumbsUp } from "lucide-react";
import { mockCommentRows } from "@/lib/mockData";
import { DashboardCard } from "@/src/components/dashboard/DashboardCard";
import { Badge } from "@/src/components/dashboard/Badge";
import { ActionButton } from "@/src/components/dashboard/ActionButton";
import { Modal } from "@/src/components/dashboard/Modal";

interface CommentRow {
	id: string;
	author: string;
	email: string;
	relatedTo: string;
	relatedType: "campaign" | "post" | "update";
	content: string;
	sentiment: "positive" | "neutral" | "negative";
	status: "pending" | "approved" | "rejected";
	createdAt: string;
}

export default function CommentsPage() {
	const [selectedComment, setSelectedComment] = useState<CommentRow | null>(
		null,
	);
	const [showModal, setShowModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState<
		"all" | "pending" | "approved" | "rejected"
	>("all");
	const [filterSentiment, setFilterSentiment] = useState<
		"all" | "positive" | "neutral" | "negative"
	>("all");
	const [sortBy, setSortBy] = useState<"recent" | "oldest">("recent");

	const commentRows: CommentRow[] = mockCommentRows.map((comment) => ({
		id: comment.id,
		author: comment.author,
		email: comment.email,
		relatedTo: comment.relatedTo,
		relatedType: comment.relatedType as any,
		content: comment.content,
		sentiment: comment.sentiment as any,
		status: comment.status as any,
		createdAt: new Date(comment.createdAt).toLocaleDateString(),
	}));

	const filteredComments = commentRows
		.filter((comment) => {
			const matchesSearch =
				comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
				comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
				comment.relatedTo.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus =
				filterStatus === "all" || comment.status === filterStatus;
			const matchesSentiment =
				filterSentiment === "all" || comment.sentiment === filterSentiment;
			return matchesSearch && matchesStatus && matchesSentiment;
		})
		.sort((a, b) => {
			if (sortBy === "recent")
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		});

	const handleApprove = (id: string) => {
		console.log("Approved comment:", id);
	};

	const handleReject = (id: string) => {
		console.log("Rejected comment:", id);
	};

	const handleView = (comment: CommentRow) => {
		setSelectedComment(comment);
		setShowModal(true);
	};

	const pendingComments = commentRows.filter(
		(c) => c.status === "pending",
	).length;
	const approvedComments = commentRows.filter(
		(c) => c.status === "approved",
	).length;
	const positiveComments = commentRows.filter(
		(c) => c.sentiment === "positive",
	).length;

	const pendingCount = mockCommentRows.filter(
		(c) => c.status === "pending",
	).length;
	const approvedCount = mockCommentRows.filter(
		(c) => c.status === "approved",
	).length;
	const rejectedCount = mockCommentRows.filter(
		(c) => c.status === "rejected",
	).length;

	return (
		<div className="space-y-8 pb-8">
			{/* Page Header */}
			<div>
				<h1 className="text-4xl font-bold font-display text-setu-950 mb-2">
					Comments & Feedback
				</h1>
				<p className="text-setu-600">
					Manage user comments and feedback across campaigns
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<DashboardCard
					title="Total Comments"
					value={commentRows.length}
					subtitle="community feedback"
					icon={MessageSquare}
					color="blue"
					trend={{ value: 6, direction: "up" }}
				/>
				<DashboardCard
					title="Pending Review"
					value={pendingCount}
					subtitle="awaiting moderation"
					icon={Clock}
					color="blue"
					trend={{ value: 3, direction: "down" }}
				/>
				<DashboardCard
					title="Approved"
					value={approvedCount}
					subtitle="published comments"
					icon={CheckCircle}
					color="blue"
					trend={{ value: 9, direction: "up" }}
				/>
				<DashboardCard
					title="Positive Sentiment"
					value="78%"
					subtitle="of comments"
					icon={ThumbsUp}
					color="blue"
					trend={{ value: 4, direction: "up" }}
				/>
				<DashboardCard
					title="Pending Review"
					value={pendingComments}
					subtitle="awaiting approval"
					variant="green"
					icon={Clock}
					trend={pendingComments > 0 ? -5 : 0}
				/>
				<DashboardCard
					title="Approved"
					value={approvedComments}
					subtitle="published comments"
					variant="green"
					icon={CheckCircle}
				/>
				<DashboardCard
					title="Positive Sentiment"
					value={`${((positiveComments / commentRows.length) * 100).toFixed(0)}%`}
					subtitle="of total feedback"
					variant="green"
					icon={ThumbsUp}
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
						placeholder="Search by author, content, or related campaign..."
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
							<option value="pending">Pending</option>
							<option value="approved">Approved</option>
							<option value="rejected">Rejected</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-semibold text-setu-900 mb-2">
							Sentiment
						</label>
						<select
							value={filterSentiment}
							onChange={(e) => setFilterSentiment(e.target.value as any)}
							className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu text-sm">
							<option value="all">All</option>
							<option value="positive">Positive</option>
							<option value="neutral">Neutral</option>
							<option value="negative">Negative</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-semibold text-setu-900 mb-2">
							Sort
						</label>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as any)}
							className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu text-sm">
							<option value="recent">Most Recent</option>
							<option value="oldest">Oldest</option>
						</select>
					</div>
				</div>
			</div>

			{/* Comments List */}
			<div className="space-y-4">
				{filteredComments.length > 0 ? (
					filteredComments.map((comment) => (
						<div
							key={comment.id}
							className="bg-white border border-setu-200 rounded-xl p-6 card-lift hover:shadow-md transition-all">
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<h3 className="font-semibold text-setu-950">
											{comment.author}
										</h3>
										<span className="text-xs text-setu-600">
											{comment.email}
										</span>
									</div>
									<p className="text-sm text-setu-600 mb-2">
										on{" "}
										<span className="font-medium text-setu-700">
											{comment.relatedTo}
										</span>
									</p>
								</div>
								<div className="flex gap-2">
									<Badge
										variant={
											comment.status === "approved"
												? "success"
												: comment.status === "pending"
													? "warning"
													: "secondary"
										}>
										{comment.status.charAt(0).toUpperCase() +
											comment.status.slice(1)}
									</Badge>
									<Badge
										variant={
											comment.sentiment === "positive"
												? "success"
												: comment.sentiment === "neutral"
													? "default"
													: "secondary"
										}>
										{comment.sentiment === "positive"
											? "👍"
											: comment.sentiment === "neutral"
												? "→"
												: "👎"}{" "}
										{comment.sentiment.charAt(0).toUpperCase() +
											comment.sentiment.slice(1)}
									</Badge>
								</div>
							</div>

							<p className="text-setu-700 mb-4 leading-relaxed">
								{comment.content}
							</p>

							<div className="flex items-center justify-between pt-4 border-t border-setu-200">
								<p className="text-xs text-setu-600">{comment.createdAt}</p>
								<div className="flex gap-2">
									{comment.status === "pending" && (
										<>
											<button
												onClick={() => handleApprove(comment.id)}
												className="px-3 py-1 bg-setu-100 text-setu-700 rounded-lg text-sm font-semibold hover:bg-setu-200 transition-colors">
												Approve
											</button>
											<button
												onClick={() => handleReject(comment.id)}
												className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors">
												Reject
											</button>
										</>
									)}
									<button
										onClick={() => handleView(comment)}
										className="px-3 py-1 bg-white border border-setu-300 text-setu-700 rounded-lg text-sm font-semibold hover:bg-setu-50 transition-colors">
										View
									</button>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="bg-white border border-setu-200 rounded-xl p-12 text-center">
						<p className="text-setu-600 text-lg">
							No comments found matching your filters
						</p>
					</div>
				)}
			</div>

			{/* Comment Detail Modal */}
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setSelectedComment(null);
				}}
				title="Comment Details">
				{selectedComment && (
					<div className="space-y-4">
						<div>
							<p className="text-xs text-setu-600 mb-1">Author</p>
							<p className="font-semibold text-setu-950">
								{selectedComment.author}
							</p>
							<p className="text-sm text-setu-600">{selectedComment.email}</p>
						</div>

						<div>
							<p className="text-xs text-setu-600 mb-1">Related To</p>
							<p className="font-semibold text-setu-950">
								{selectedComment.relatedTo}
							</p>
							<Badge
								variant="secondary"
								className="text-xs mt-2">
								{selectedComment.relatedType}
							</Badge>
						</div>

						<div>
							<p className="text-xs text-setu-600 mb-1">Comment</p>
							<p className="text-setu-700 leading-relaxed bg-setu-50 p-3 rounded-lg">
								{selectedComment.content}
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-xs text-setu-600 mb-2">Status</p>
								<Badge
									variant={
										selectedComment.status === "approved"
											? "success"
											: selectedComment.status === "pending"
												? "warning"
												: "secondary"
									}>
									{selectedComment.status.charAt(0).toUpperCase() +
										selectedComment.status.slice(1)}
								</Badge>
							</div>
							<div>
								<p className="text-xs text-setu-600 mb-2">Sentiment</p>
								<Badge
									variant={
										selectedComment.sentiment === "positive"
											? "success"
											: selectedComment.sentiment === "neutral"
												? "default"
												: "secondary"
									}>
									{selectedComment.sentiment}
								</Badge>
							</div>
						</div>

						<div>
							<p className="text-xs text-setu-600 mb-1">Posted on</p>
							<p className="text-sm text-setu-700">
								{selectedComment.createdAt}
							</p>
						</div>

						{selectedComment.status === "pending" && (
							<div className="flex gap-3 justify-end pt-4 border-t border-setu-200 mt-4">
								<button
									onClick={() => setShowModal(false)}
									className="px-4 py-2 border border-setu-300 text-setu-700 rounded-lg font-semibold hover:bg-setu-50 transition-colors">
									Close
								</button>
								<button
									onClick={() => {
										handleApprove(selectedComment.id);
										setShowModal(false);
									}}
									className="px-4 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
									Approve
								</button>
							</div>
						)}
					</div>
				)}
			</Modal>
		</div>
	);
}
