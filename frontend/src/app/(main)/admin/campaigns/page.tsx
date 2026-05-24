"use client";

import { useMemo, useState } from "react";
import {
	CheckCircle,
	XCircle,
	Eye,
	Pause,
	Play,
	Search,
	X,
	Users,
} from "lucide-react";
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
	useSuspendCampaign,
	useUnsuspendCampaign,
	useUpdateCampaign,
	useDeleteCampaign,
	type Campaign as ApiCampaign,
} from "@/src/hooks/useCampaign";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useGetCategories, type Category } from "@/src/hooks/useCategory";
import { useGetCampaignPayments } from "@/src/hooks/usePayment";

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
	const [isDonorsModalOpen, setIsDonorsModalOpen] = useState(false);
	const [viewingDonorsCampaignId, setViewingDonorsCampaignId] = useState<
		string | null
	>(null);

	const [actionType, setActionType] = useState<
		"approve" | "reject" | "suspend" | "unsuspend" | "delete" | null
	>(null);
	const [reasonInput, setReasonInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearch = useDebounce(searchQuery, 500);

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
	const { mutate: suspendCampaign, isPending: suspending } =
		useSuspendCampaign();
	const { mutate: unsuspendCampaign, isPending: unsuspending } =
		useUnsuspendCampaign();

	const { data, isLoading, isError, error, refetch } = useGetAllCampaigns({
		page: 1,
		limit: 100,
		search: debouncedSearch || undefined,
	});

	const campaigns: CampaignRow[] = useMemo(() => {
		const items = data?.campaigns ?? [];
		return items.map(transformCampaign);
	}, [data?.campaigns]);

	const { mutate: approveCampaign, isPending: approving } =
		useApproveCampaign();
	const { mutate: rejectCampaign, isPending: rejecting } = useRejectCampaign();
	const { mutate: deleteCampaign, isPending: deleting } = useDeleteCampaign();
	const isMutating =
		approving || rejecting || suspending || unsuspending || deleting;

	const handleApprove = (campaign: CampaignRow) => {
		setSelectedCampaign(campaign);
		setActionType("approve");
		setIsActionModalOpen(true);
	};

	const handleReject = (campaign: CampaignRow) => {
		setSelectedCampaign(campaign);
		setActionType("reject");
		setReasonInput("");
		setIsActionModalOpen(true);
	};

	const handleSuspend = (campaign: CampaignRow) => {
		setSelectedCampaign(campaign);
		setActionType("suspend");
		setReasonInput("");
		setIsActionModalOpen(true);
	};

	const handleUnsuspend = (campaign: CampaignRow) => {
		setSelectedCampaign(campaign);
		setActionType("unsuspend");
		setIsActionModalOpen(true);
	};

	const handleViewDonors = (campaign: CampaignRow) => {
		setViewingDonorsCampaignId(campaign.id);
		setSelectedCampaign(campaign);
		setIsDonorsModalOpen(true);
	};

	const handleViewDetails = (campaign: CampaignRow) => {
		router.push(`/admin/campaigns/${campaign.id}`);
	};

	const handleDelete = (campaign: CampaignRow) => {
		setSelectedCampaign(campaign);
		setActionType("delete");
		setIsActionModalOpen(true);
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
				endDate: editForm.endDate
					? toISODateTimeFromYMD(editForm.endDate)
					: undefined,
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
		} else if (actionType === "reject") {
			const reason = reasonInput.trim();
			if (!reason) {
				toast.error("Please provide a rejection reason.");
				return;
			}
			rejectCampaign({ id: selectedCampaign.id, reason });
		} else if (actionType === "suspend") {
			const reason = reasonInput.trim();
			if (!reason) {
				toast.error("Please provide a suspension reason.");
				return;
			}
			suspendCampaign({ id: selectedCampaign.id, reason });
		} else if (actionType === "unsuspend") {
			unsuspendCampaign(selectedCampaign.id);
		} else if (actionType === "delete") {
			deleteCampaign(selectedCampaign.id);
		}

		setIsActionModalOpen(false);
		setSelectedCampaign(null);
		setActionType(null);
		setReasonInput("");
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
					{row.status !== "pending" && (
						<ActionButton
							icon={Users}
							label="Donors"
							variant="info"
							size="sm"
							onClick={() => handleViewDonors(row)}
						/>
					)}
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
					{row.status === "active" && (
						<ActionButton
							icon={Pause}
							label="Suspend"
							variant="reject"
							size="sm"
							onClick={() => handleSuspend(row)}
						/>
					)}
					{row.status === "suspended" && (
						<ActionButton
							icon={Play}
							label="Unsuspend"
							variant="approve"
							size="sm"
							onClick={() => handleUnsuspend(row)}
						/>
					)}
					{(row.status === "rejected" || row.status === "suspended") && (
						<ActionButton
							label="Delete"
							variant="delete"
							size="sm"
							onClick={() => handleDelete(row)}
						/>
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
						{isLoading
							? "..."
							: campaigns.filter((c) => c.status === "pending").length}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg border border-setu-100">
					<p className="text-sm text-setu-600 mb-1">Active</p>
					<p className="text-2xl font-bold text-green-600">
						{isLoading
							? "..."
							: campaigns.filter((c) => c.status === "active").length}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg border border-setu-100">
					<p className="text-sm text-setu-600 mb-1">Rejected</p>
					<p className="text-2xl font-bold text-red-600">
						{isLoading
							? "..."
							: campaigns.filter((c) => c.status === "rejected").length}
					</p>
				</div>
			</div>

			{/* Search Bar */}
			<div className="flex justify-between items-center bg-white p-4 rounded-xl border border-setu-100 shadow-sm">
				<div className="relative flex-1 max-w-md">
					<Search
						size={18}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-setu-400"
					/>
					<input
						type="text"
						placeholder="Search campaigns by title..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-10 py-2.5 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500 focus:border-transparent transition-all"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-setu-400 hover:text-setu-600 transition-colors">
							<X size={16} />
						</button>
					)}
				</div>
				<div className="text-sm text-setu-500">
					{isLoading ? (
						"Searching..."
					) : (
						<>
							Showing{" "}
							<span className="font-bold text-setu-900">
								{campaigns.length}
							</span>{" "}
							results
						</>
					)}
				</div>
			</div>

			{/* Campaigns Table */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-12 gap-4 bg-white rounded-lg border border-setu-100">
					<div className="w-10 h-10 rounded-full bg-setu-50 border border-setu-100 flex items-center justify-center text-setu-500">
						...
					</div>
					<p className="text-sm text-setu-600 font-medium">
						Loading campaigns...
					</p>
				</div>
			) : (
				<DataTable
					data={campaigns}
					columns={columns}
					title="All Campaigns"
				/>
			)}

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
								updating ? "bg-setu-300" : "bg-setu-600 hover:bg-setu-700"
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
									disabled={
										updating || categoriesLoading || categories.length === 0
									}
									className="w-full px-4 py-2 border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-setu-500/20 focus:border-setu-500 transition-colors mt-1">
									{categoriesLoading ? (
										<option value="">Loading...</option>
									) : categories.length === 0 ? (
										<option value="">No categories</option>
									) : (
										<>
											{categories.map((cat) => (
												<option
													key={cat._id}
													value={cat._id}>
													{cat.name}
												</option>
											))}
											{editForm.categoryId &&
												!categories.some(
													(c) => c._id === editForm.categoryId,
												) && (
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
							<p className="text-sm text-setu-700 font-medium">
								Urgent campaign
							</p>
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
					setReasonInput("");
				}}
				title={
					actionType === "approve"
						? "Approve Campaign"
						: actionType === "reject"
							? "Reject Campaign"
							: actionType === "suspend"
								? "Suspend Campaign"
								: actionType === "unsuspend"
									? "Unsuspend Campaign"
									: "Delete Campaign"
				}
				footer={
					<div className="flex gap-3">
						<button
							onClick={() => {
								setIsActionModalOpen(false);
								setReasonInput("");
							}}
							className="px-4 py-2 rounded-lg border border-setu-200 text-setu-700 hover:bg-setu-50 font-medium transition-colors">
							Cancel
						</button>
						<button
							onClick={confirmAction}
							disabled={isMutating}
							className={`px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
								actionType === "approve" || actionType === "unsuspend"
									? "bg-green-600 hover:bg-green-700"
									: "bg-red-600 hover:bg-red-700"
							}`}>
							{actionType === "approve"
								? approving
									? "Approving..."
									: "Approve"
								: actionType === "reject"
									? rejecting
										? "Rejecting..."
										: "Reject"
									: actionType === "suspend"
										? suspending
											? "Suspending..."
											: "Suspend"
										: actionType === "unsuspend"
											? unsuspending
												? "Unsuspending..."
												: "Unsuspend"
											: deleting
												? "Deleting..."
												: "Delete"}
						</button>
					</div>
				}>
				<div className="space-y-4">
					<p className="text-setu-700">
						{actionType === "approve"
							? `Are you sure you want to approve the campaign "${selectedCampaign?.title}"? This will make it visible to all donors.`
							: actionType === "reject"
								? `Are you sure you want to reject the campaign "${selectedCampaign?.title}"? This action cannot be undone.`
								: actionType === "suspend"
									? `Are you sure you want to suspend the campaign "${selectedCampaign?.title}"? It will no longer be visible to donors.`
									: actionType === "unsuspend"
										? `Are you sure you want to reactivate the campaign "${selectedCampaign?.title}"? It will be visible to donors again.`
										: `Are you sure you want to delete the campaign "${selectedCampaign?.title}"? This action cannot be undone and will permanently remove all associated data.`}
					</p>

					{(actionType === "reject" || actionType === "suspend") && (
						<div className="space-y-2">
							<p className="text-sm text-setu-700 font-medium">
								{actionType === "reject"
									? "Rejection reason"
									: "Suspension reason"}{" "}
								<span className="text-red-500">*</span>
							</p>
							<textarea
								value={reasonInput}
								onChange={(e) => setReasonInput(e.target.value)}
								placeholder={`Explain why this campaign is being ${
									actionType === "reject" ? "rejected" : "suspended"
								}...`}
								rows={4}
								className="w-full px-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-400 focus:outline-none focus:border-setu-500 transition-colors resize-none"
							/>
							<p className="text-xs text-gray-500">
								A reason is required to process this action.
							</p>
						</div>
					)}

					<div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
						<p className="text-sm text-yellow-800">
							{actionType === "approve"
								? "Approved campaigns will be featured on the platform."
								: actionType === "reject"
									? "Rejected campaigns cannot be reactivated."
									: actionType === "suspend"
										? "Suspended campaigns can be reactivated later."
										: actionType === "unsuspend"
											? "This campaign will once again accept donations."
											: "Deleting a campaign is permanent and irreversible."}
						</p>
					</div>
				</div>
			</Modal>

			{/* Donors List Modal */}
			<DonorsModal
				isOpen={isDonorsModalOpen}
				onClose={() => {
					setIsDonorsModalOpen(false);
					setViewingDonorsCampaignId(null);
					setSelectedCampaign(null);
				}}
				campaignId={viewingDonorsCampaignId}
				campaignTitle={selectedCampaign?.title}
			/>
		</div>
	);
}

// ─── Sub-component: Donors Modal ──────────────────────────────────────────────

interface DonorsModalProps {
	isOpen: boolean;
	onClose: () => void;
	campaignId: string | null;
	campaignTitle?: string;
}

function DonorsModal({
	isOpen,
	onClose,
	campaignId,
	campaignTitle,
}: DonorsModalProps) {
	const { data, isLoading } = useGetCampaignPayments(campaignId || "");
	const payments = data?.payments || [];

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Donors - ${campaignTitle || "Campaign"}`}
			size="lg"
			footer={
				<button
					onClick={onClose}
					className="px-4 py-2 rounded-lg bg-setu-100 text-setu-700 hover:bg-setu-200 font-medium transition-colors">
					Close
				</button>
			}>
			<div className="space-y-4">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-12 gap-4">
						<div className="w-8 h-8 border-4 border-setu-200 border-t-setu-600 rounded-full animate-spin" />
						<p className="text-sm text-setu-600">Loading donors...</p>
					</div>
				) : payments.length === 0 ? (
					<div className="text-center py-12 bg-setu-50 rounded-lg border border-dashed border-setu-200">
						<Users
							size={40}
							className="mx-auto text-setu-300 mb-2"
						/>
						<p className="text-setu-600 font-medium">No donations yet</p>
						<p className="text-xs text-setu-400 mt-1">
							This campaign hasn't received any contributions yet.
						</p>
					</div>
				) : (
					<div className="overflow-hidden rounded-lg border border-setu-100">
						<table className="w-full text-left text-sm">
							<thead className="bg-setu-50 text-setu-700 border-b border-setu-100">
								<tr>
									<th className="px-4 py-3 font-semibold">Donor</th>
									<th className="px-4 py-3 font-semibold">Amount</th>
									<th className="px-4 py-3 font-semibold">Date</th>
									<th className="px-4 py-3 font-semibold text-right">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-setu-50 bg-white">
								{payments.map((p) => (
									<tr
										key={p._id}
										className="hover:bg-setu-50 transition-colors">
										<td className="px-4 py-3">
											<div>
												<p className="font-medium text-setu-900">
													{p.anonymous
														? "Anonymous Donor"
														: p.donor?.name || "Unknown User"}
												</p>
												{!p.anonymous && p.donor?.email && (
													<p className="text-xs text-setu-500">
														{p.donor.email}
													</p>
												)}
											</div>
										</td>
										<td className="px-4 py-3">
											<p className="font-semibold text-green-600">
												₨{p.amount.toLocaleString()}
											</p>
											{p.tipAmount > 0 && (
												<p className="text-[10px] text-setu-400">
													+ ₨{p.tipAmount} tip
												</p>
											)}
										</td>
										<td className="px-4 py-3 text-setu-600">
											{new Date(p.paidAt || p.createdAt).toLocaleDateString()}
										</td>
										<td className="px-4 py-3 text-right">
											<Badge
												variant={
													p.status === "completed" ? "success" : "pending"
												}
												size="sm">
												{p.status}
											</Badge>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{!isLoading && payments.length > 0 && (
					<p className="text-xs text-setu-400 italic">
						* Showing the most recent contributions to this campaign.
					</p>
				)}
			</div>
		</Modal>
	);
}
