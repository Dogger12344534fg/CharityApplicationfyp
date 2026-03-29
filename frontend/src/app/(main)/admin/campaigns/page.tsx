"use client";

import { useMemo, useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/src/components/dashboard/DataTable";
import Badge from "@/src/components/dashboard/Badge";
import ActionButton from "@/src/components/dashboard/ActionButton";
import Modal from "@/src/components/dashboard/Modal";
import { useRouter } from "next/navigation";
import {
	useApproveCampaign,
	useGetAllCampaigns,
	useRejectCampaign,
	useUpdateCampaign,
	type Campaign as ApiCampaign,
} from "@/src/hooks/useCampaign";
import { useGetCategories, type Category } from "@/src/hooks/useCategory";

type CampaignStatus = ApiCampaign["status"];

type CampaignRow = {
	id: string;
	title: string;
	description: string;
	category: string;
	categoryId: string;
	status: CampaignStatus;
	fundedAmount: number;
	targetAmount: number;
	donorCount: number;
	urgent: boolean;
	startDate: string;
	endDate?: string;
	createdBy: string;
};

const transformCampaign = (c: ApiCampaign): CampaignRow => ({
	id: c._id,
	title: c.title,
	description: c.description,
	category: c.category?.name ?? "",
	categoryId: c.category?._id ?? "",
	status: c.status,
	fundedAmount: c.raisedAmount,
	targetAmount: c.goalAmount,
	donorCount: c.donorsCount,
	urgent: c.urgent,
	startDate: c.startDate,
	endDate: c.endDate,
	createdBy: c.createdBy?.name ?? "",
});

const formatStatus = (status: string) =>
	status.charAt(0).toUpperCase() + status.slice(1);

const getStatusBadge = (
	status: CampaignStatus,
): "success" | "warning" | "error" | "info" | "pending" => {
	const variants: Record<
		CampaignStatus,
		"success" | "warning" | "error" | "info" | "pending"
	> = {
		pending: "pending",
		active: "info",
		completed: "success",
		rejected: "error",
		suspended: "warning",
	};

	return variants[status];
};

const toDateInputValue = (isoDate?: string): string => {
	if (!isoDate) return "";
	const d = new Date(isoDate);
	if (Number.isNaN(d.getTime())) return "";
	return d.toISOString().slice(0, 10); // yyyy-mm-dd
};

const toISODateTimeFromYMD = (ymd: string): string => {
	// force UTC midnight to avoid timezone shifts
	return new Date(`${ymd}T00:00:00.000Z`).toISOString();
};

export default function CampaignsPage() {
	const router = useRouter();

	const [selectedCampaign, setSelectedCampaign] = useState<CampaignRow | null>(
		null,
	);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isActionModalOpen, setIsActionModalOpen] = useState(false);
	const [actionType, setActionType] = useState<"approve" | "reject" | null>(
		null,
	);
	const [rejectionReason, setRejectionReason] = useState("");
	const { data: categoriesData, isLoading: categoriesLoading } =
		useGetCategories({ page: 1, limit: 200 });

	const categories: Category[] = categoriesData?.data ?? [];

	const [editForm, setEditForm] = useState<{
		title: string;
		description: string;
		categoryId: string;
		goalAmount: number;
		urgent: boolean;
		endDate: string; // yyyy-mm-dd for <input type="date" />
	}>({
		title: "",
		description: "",
		categoryId: "",
		goalAmount: 0,
		urgent: false,
		endDate: "",
	});

	const { mutate: updateCampaign, isPending: updating } = useUpdateCampaign();

	const { data, isLoading, isError, error, refetch } = useGetAllCampaigns({
		page: 1,
		limit: 100,
	});

	const campaigns: CampaignRow[] = useMemo(() => {
		const items = data?.campaigns ?? [];
		return items.map(transformCampaign);
	}, [data?.campaigns]);

	const { mutate: approveCampaign, isPending: approving } = useApproveCampaign();
	const { mutate: rejectCampaign, isPending: rejecting } = useRejectCampaign();
	const isMutating = approving || rejecting;

	const handleApprove = (campaign: CampaignRow) => {
		setSelectedCampaign(campaign);
		setActionType("approve");
		setIsActionModalOpen(true);
	};

	const handleReject = (campaign: CampaignRow) => {
		setSelectedCampaign(campaign);
		setActionType("reject");
		setRejectionReason("");
		setIsActionModalOpen(true);
	};

	const handleViewDetails = (campaign: CampaignRow) => {
		setSelectedCampaign(campaign);
		setIsEditModalOpen(false);
		setIsDetailModalOpen(true);
	};

	const handleEditCampaign = (campaign: CampaignRow) => {
		setSelectedCampaign(campaign);
		setIsDetailModalOpen(false);
		setEditForm({
			title: campaign.title,
			description: campaign.description,
			categoryId: campaign.categoryId,
			goalAmount: campaign.targetAmount,
			urgent: campaign.urgent,
			endDate: toDateInputValue(campaign.endDate),
		});
		setIsEditModalOpen(true);
	};

	const handleSaveEdit = () => {
		if (!selectedCampaign) return;

		const title = editForm.title.trim();
		const description = editForm.description.trim();

		if (!title) {
			toast.error("Title is required.");
			return;
		}
		if (!editForm.categoryId) {
			toast.error("Please select a category.");
			return;
		}
		if (!Number.isFinite(editForm.goalAmount) || editForm.goalAmount <= 0) {
			toast.error("Goal amount must be greater than 0.");
			return;
		}

		updateCampaign(
			{
				id: selectedCampaign.id,
				title,
				description,
				category: editForm.categoryId,
				goalAmount: editForm.goalAmount,
				urgent: editForm.urgent,
				endDate: editForm.endDate ? toISODateTimeFromYMD(editForm.endDate) : undefined,
			},
			{
				onSuccess: () => {
					toast.success("Campaign updated successfully.");
					setIsEditModalOpen(false);
					setSelectedCampaign(null);
				},
			},
		);
	};

	const confirmAction = () => {
		if (!selectedCampaign || !actionType) return;

		if (actionType === "approve") {
			approveCampaign(selectedCampaign.id);
		} else {
			const reason = rejectionReason.trim();
			if (!reason) {
				toast.error("Please provide a rejection reason.");
				return;
			}
			rejectCampaign({ id: selectedCampaign.id, reason });
		}

		setIsActionModalOpen(false);
		setSelectedCampaign(null);
		setActionType(null);
		setRejectionReason("");
	};

	const columns = [
		{
			key: "title" as const,
			label: "Campaign Title",
			sortable: true,
		},
		{
			key: "category" as const,
			label: "Category",
			sortable: true,
		},
		{
			key: "status" as const,
			label: "Status",
			sortable: true,
			render: (value: CampaignStatus) => (
				<Badge
					variant={getStatusBadge(value)}
					size="sm">
					{formatStatus(value)}
				</Badge>
			),
		},
		{
			key: "fundedAmount" as const,
			label: "Funded",
			sortable: true,
			render: (value: number, row: CampaignRow) => (
				<div className="text-sm">
					<p className="font-medium">₨{value.toLocaleString()}</p>
					<div className="w-24 bg-setu-100 rounded-full h-2 mt-1">
						<div
							className="bg-setu-500 h-full rounded-full"
							style={{
								width: `${
									row.targetAmount
										? Math.min((value / row.targetAmount) * 100, 100)
										: 0
								}%`,
							}}
						/>
					</div>
				</div>
			),
		},
		{
			key: "donorCount" as const,
			label: "Donors",
			sortable: true,
			render: (value: number) => (
				<span className="font-medium text-setu-900">{value}</span>
			),
		},
		{
			key: "id" as const,
			label: "Actions",
			render: (_: string, row: CampaignRow) => (
				<div className="flex gap-2">
					<ActionButton
						icon={Eye}
						label="View"
						variant="view"
						size="sm"
						onClick={() => handleViewDetails(row)}
					/>
					<ActionButton
						variant="edit"
						size="sm"
						onClick={() => handleEditCampaign(row)}
					/>
					{row.status === "pending" && (
						<>
							<ActionButton
								icon={CheckCircle}
								label="Approve"
								variant="approve"
								size="sm"
								onClick={() => handleApprove(row)}
							/>
							<ActionButton
								icon={XCircle}
								label="Reject"
								variant="reject"
								size="sm"
								onClick={() => handleReject(row)}
							/>
						</>
					)}
				</div>
			),
		},
	];

	if (isError && !isLoading) {
		return (
			<div className="space-y-6 animate-fade-in-up">
				<div className="flex justify-between">
					<div>
						<h1 className="text-3xl font-display font-bold text-setu-900">
							Campaign Management
						</h1>
						<p className="text-setu-500 mt-2">
							Review, approve, and manage disaster relief campaigns
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
						Failed to load campaigns.
					</p>
					<p className="text-sm text-red-500/90 mt-1">
						{error?.message || "Please try again."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-fade-in-up">
			<div className="flex justify-between">
				<div>
					<h1 className="text-3xl font-display font-bold text-setu-900">
						Campaign Management
					</h1>
					<p className="text-setu-500 mt-2">
						Review, approve, and manage disaster relief campaigns
					</p>
				</div>
				<button
					onClick={() => {
						router.push("/admin/campaigns/create");
					}}
					className="px-5 h-10 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
					+ New Campaign
				</button>
			</div>

			{/* Campaign Statistics */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border border-setu-100">
					<p className="text-sm text-setu-600 mb-1">Total Campaigns</p>
					<p className="text-2xl font-bold text-setu-900">
						{isLoading ? "..." : campaigns.length}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg border border-setu-100">
					<p className="text-sm text-setu-600 mb-1">Pending</p>
					<p className="text-2xl font-bold text-blue-600">
						{isLoading ? "..." : campaigns.filter((c) => c.status === "pending").length}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg border border-setu-100">
					<p className="text-sm text-setu-600 mb-1">Active</p>
					<p className="text-2xl font-bold text-green-600">
						{isLoading ? "..." : campaigns.filter((c) => c.status === "active").length}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg border border-setu-100">
					<p className="text-sm text-setu-600 mb-1">Rejected</p>
					<p className="text-2xl font-bold text-red-600">
						{isLoading ? "..." : campaigns.filter((c) => c.status === "rejected").length}
					</p>
				</div>
			</div>

			{/* Campaigns Table */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-12 gap-4 bg-white rounded-lg border border-setu-100">
					<div className="w-10 h-10 rounded-full bg-setu-50 border border-setu-100 flex items-center justify-center text-setu-500">
						...
					</div>
					<p className="text-sm text-setu-600 font-medium">Loading campaigns...</p>
				</div>
			) : (
				<DataTable
					data={campaigns}
					columns={columns}
					searchableFields={["title", "category"]}
					title="All Campaigns"
				/>
			)}

			{/* Campaign Details Modal */}
			<Modal
				isOpen={isDetailModalOpen}
				onClose={() => {
					setIsDetailModalOpen(false);
					setSelectedCampaign(null);
				}}
				title="Campaign Details"
				footer={
					<button
						onClick={() => setIsDetailModalOpen(false)}
						className="px-4 py-2 rounded-lg bg-setu-100 text-setu-700 hover:bg-setu-200 font-medium transition-colors">
						Close
					</button>
				}>
				{selectedCampaign && (
					<div className="space-y-4">
						<div>
							<p className="text-sm text-setu-600">Title</p>
							<p className="text-lg font-semibold text-setu-900 mt-1">
								{selectedCampaign.title}
							</p>
						</div>

						<div>
							<p className="text-sm text-setu-600">Description</p>
							<p className="text-sm text-setu-700 mt-1">
								{selectedCampaign.description}
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-setu-600">Category</p>
								<p className="font-medium text-setu-900 mt-1">
									{selectedCampaign.category}
								</p>
							</div>
							<div>
								<p className="text-sm text-setu-600">Status</p>
								<Badge
									variant={getStatusBadge(selectedCampaign.status)}
									size="sm"
								>
									{formatStatus(selectedCampaign.status)}
								</Badge>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-setu-600">Target Amount</p>
								<p className="font-semibold text-setu-900 mt-1">
									₨{selectedCampaign.targetAmount.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-sm text-setu-600">Funded Amount</p>
								<p className="font-semibold text-green-600 mt-1">
									₨{selectedCampaign.fundedAmount.toLocaleString()}
								</p>
							</div>
						</div>

						<div>
							<p className="text-sm text-setu-600 mb-2">Funding Progress</p>
							<div className="bg-setu-100 rounded-full h-3 overflow-hidden">
								<div
									className="bg-setu-500 h-full transition-all duration-300"
									style={{
										width: `${
											selectedCampaign.targetAmount
												? Math.min(
													(selectedCampaign.fundedAmount /
														selectedCampaign.targetAmount) *
														100,
													100,
												)
												: 0
										}%`,
									}}
								/>
							</div>
							<p className="text-sm text-setu-500 mt-2">
								{Math.round(
									selectedCampaign.targetAmount
										? (selectedCampaign.fundedAmount /
												selectedCampaign.targetAmount) *
											100
										: 0,
								)}
								% funded
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-setu-600">Total Donors</p>
								<p className="font-semibold text-setu-900 mt-1">
									{selectedCampaign.donorCount}
								</p>
							</div>
							<div>
								<p className="text-sm text-setu-600">Created By</p>
								<p className="font-semibold text-setu-900 mt-1">
									{selectedCampaign.createdBy}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-setu-600">Start Date</p>
								<p className="text-sm text-setu-900 mt-1">
									{new Date(selectedCampaign.startDate).toLocaleDateString()}
								</p>
							</div>
							<div>
								<p className="text-sm text-setu-600">End Date</p>
								<p className="text-sm text-setu-900 mt-1">
									{selectedCampaign.endDate
										? new Date(selectedCampaign.endDate).toLocaleDateString()
										: "—"}
								</p>
							</div>
						</div>
					</div>
				)}
			</Modal>

			{/* Edit Campaign Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedCampaign(null);
					setEditForm({
						title: "",
						description: "",
						categoryId: "",
						goalAmount: 0,
						urgent: false,
						endDate: "",
					});
				}}
				title="Edit Campaign"
				footer={
					<div className="flex gap-3 justify-end">
						<button
							onClick={() => {
								setIsEditModalOpen(false);
								setSelectedCampaign(null);
								setEditForm({
									title: "",
									description: "",
									categoryId: "",
									goalAmount: 0,
									urgent: false,
									endDate: "",
								});
							}}
							className="px-4 py-2 rounded-lg border border-setu-200 text-setu-700 hover:bg-setu-50 font-medium transition-colors">
							Cancel
						</button>
						<button
							onClick={handleSaveEdit}
							disabled={updating}
							className={`px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
								updating
									? "bg-setu-300"
									: "bg-setu-600 hover:bg-setu-700"
							}`}>
							{updating ? "Saving..." : "Save Changes"}
						</button>
					</div>
				}>
				{selectedCampaign && (
					<div className="space-y-4">
						<div>
							<p className="text-sm text-setu-600">Title</p>
							<input
								type="text"
								value={editForm.title}
								onChange={(e) =>
									setEditForm((f) => ({ ...f, title: e.target.value }))
								}
								disabled={updating}
								className="w-full px-4 py-2 border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-setu-500/20 focus:border-setu-500 transition-colors mt-1"
							/>
						</div>

						<div>
							<p className="text-sm text-setu-600">Description</p>
							<textarea
								value={editForm.description}
								onChange={(e) =>
									setEditForm((f) => ({ ...f, description: e.target.value }))
								}
								disabled={updating}
								rows={4}
								className="w-full px-4 py-2 border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-setu-500/20 focus:border-setu-500 transition-colors mt-1 resize-none"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-setu-600">Category</p>
								<select
									value={editForm.categoryId}
									onChange={(e) =>
										setEditForm((f) => ({ ...f, categoryId: e.target.value }))
									}
									disabled={updating || categoriesLoading || categories.length === 0}
									className="w-full px-4 py-2 border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-setu-500/20 focus:border-setu-500 transition-colors mt-1">
									{categoriesLoading ? (
										<option value="">Loading...</option>
									) : categories.length === 0 ? (
										<option value="">No categories</option>
									) : (
										<>
											{categories.map((cat) => (
												<option key={cat._id} value={cat._id}>
													{cat.name}
												</option>
											))}
											{editForm.categoryId &&
												!categories.some((c) => c._id === editForm.categoryId) && (
													<option value={editForm.categoryId}>
														{selectedCampaign.category || "Unknown category"}
													</option>
												)}
										</>
									)}
								</select>
							</div>

							<div>
								<p className="text-sm text-setu-600">Goal Amount</p>
								<input
									type="number"
									min={0}
									value={editForm.goalAmount}
									onChange={(e) =>
										setEditForm((f) => ({
											...f,
											goalAmount: Number(e.target.value),
										}))
									}
									disabled={updating}
									className="w-full px-4 py-2 border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-setu-500/20 focus:border-setu-500 transition-colors mt-1"
								/>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								checked={editForm.urgent}
								disabled={updating}
								onChange={(e) =>
									setEditForm((f) => ({ ...f, urgent: e.target.checked }))
								}
								className="w-4 h-4 rounded border-setu-300 text-setu-600 focus:ring-setu-500 cursor-pointer"
							/>
							<p className="text-sm text-setu-700 font-medium">Urgent campaign</p>
						</div>

						<div>
							<p className="text-sm text-setu-600">End Date</p>
							<input
								type="date"
								value={editForm.endDate}
								disabled={updating}
								onChange={(e) =>
									setEditForm((f) => ({ ...f, endDate: e.target.value }))
								}
								className="w-full px-4 py-2 border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-setu-500/20 focus:border-setu-500 transition-colors mt-1"
							/>
						</div>
					</div>
				)}
			</Modal>

			{/* Action Confirmation Modal */}
			<Modal
				isOpen={isActionModalOpen}
				onClose={() => {
					setIsActionModalOpen(false);
					setRejectionReason("");
				}}
				title={
					actionType === "approve" ? "Approve Campaign" : "Reject Campaign"
				}
				footer={
					<div className="flex gap-3">
						<button
							onClick={() => {
								setIsActionModalOpen(false);
								setRejectionReason("");
							}}
							className="px-4 py-2 rounded-lg border border-setu-200 text-setu-700 hover:bg-setu-50 font-medium transition-colors">
							Cancel
						</button>
						<button
							onClick={confirmAction}
							disabled={isMutating}
							className={`px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
								actionType === "approve"
									? "bg-green-600 hover:bg-green-700"
									: "bg-red-600 hover:bg-red-700"
							}`}>
							{actionType === "approve"
								? approving
									? "Approving..."
									: "Approve"
								: rejecting
									? "Rejecting..."
									: "Reject"}
						</button>
					</div>
				}>
				<div className="space-y-4">
					<p className="text-setu-700">
						{actionType === "approve"
							? `Are you sure you want to approve the campaign "${selectedCampaign?.title}"? This will make it visible to all donors.`
							: `Are you sure you want to reject the campaign "${selectedCampaign?.title}"? This action cannot be undone.`}
					</p>

					{actionType === "reject" && (
						<div className="space-y-2">
							<p className="text-sm text-setu-700 font-medium">
								Rejection reason <span className="text-red-500">*</span>
							</p>
							<textarea
								value={rejectionReason}
								onChange={(e) => setRejectionReason(e.target.value)}
								placeholder="Explain why this campaign is being rejected..."
								rows={4}
								className="w-full px-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-400 focus:outline-none focus:border-setu-500 transition-colors resize-none"
							/>
							<p className="text-xs text-gray-500">
								The backend requires a non-empty rejection reason.
							</p>
						</div>
					)}

					<div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
						<p className="text-sm text-yellow-800">
							{actionType === "approve"
								? "Approved campaigns will be featured on the platform."
								: "Rejected campaigns cannot be reactivated."}
						</p>
					</div>
				</div>
			</Modal>
		</div>
	);
}
