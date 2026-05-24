"use client";

import { useState } from "react";
import {
	DollarSign,
	Eye,
	CreditCard,
	Wallet,
	Zap,
	TrendingUp,
	CheckCircle,
	AlertCircle,
	Edit,
	Trash2,
	Plus,
	Search,
	X,
} from "lucide-react";
import DataTable from "@/src/components/dashboard/DataTable";
import Badge from "@/src/components/dashboard/Badge";
import { ActionButton } from "@/src/components/dashboard/ActionButton";
import Modal from "@/src/components/dashboard/Modal";
import DashboardCard from "@/src/components/dashboard/DashboardCard";
import { 
	useGetAllPayments, 
	useUpdatePaymentStatus, 
	useDeletePayment, 
	useCreateManualPayment,
	type UpdatePaymentStatusPayload,
	type CreateManualPaymentPayload 
} from "@/src/hooks/usePayment";
import { useGetAllCampaigns } from "@/src/hooks/useCampaign";
import { useGetAllUsersAdmin } from "@/src/hooks/useUser";
import { useDebounce } from "@/src/hooks/useDebounce";
import { toast } from "sonner";

type TransactionRow = {
	id: string; // transactionUuid
	paymentId: string; // backend _id
	donorName: string;
	campaignTitle: string;
	amount: number;
	method: string;
	status: string;
	date: string;
};

export default function TransactionsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearch = useDebounce(searchQuery, 500);

	const { data, isLoading, isError, error, refetch } = useGetAllPayments({
		page: 1, // for full pagination we'd use state
		limit: 100, // fetching largely for demo, normally we'd paginate 
		search: debouncedSearch || undefined,
	});

	const [selectedTransaction, setSelectedTransaction] = useState<TransactionRow | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	// Edit form state
	const [editForm, setEditForm] = useState({
		status: "" as UpdatePaymentStatusPayload["status"],
		refundReason: "",
	});

	// Create form state
	const [createForm, setCreateForm] = useState<CreateManualPaymentPayload>({
		campaignId: "",
		donorId: "",
		amount: 0,
		tipAmount: 0,
		anonymous: false,
		notes: "",
	});

	// Mutations
	const updateMutation = useUpdatePaymentStatus();
	const deleteMutation = useDeletePayment();
	const createMutation = useCreateManualPayment();

	// Data for dropdowns
	const { data: campaignsData } = useGetAllCampaigns({ limit: 200 });
	const { data: usersData } = useGetAllUsersAdmin({ limit: 200 });

	const campaigns = campaignsData?.campaigns || [];
	const users = usersData?.data?.users || [];

	const handleViewDetails = (transaction: TransactionRow) => {
		setSelectedTransaction(transaction);
		setIsDetailModalOpen(true);
	};

	const handleEdit = (transaction: TransactionRow) => {
		setSelectedTransaction(transaction);
		setEditForm({
			status: transaction.status as UpdatePaymentStatusPayload["status"],
			refundReason: "",
		});
		setIsEditModalOpen(true);
	};

	const handleDelete = (transaction: TransactionRow) => {
		setSelectedTransaction(transaction);
		setIsDeleteModalOpen(true);
	};

	const handleCreate = () => {
		setCreateForm({
			campaignId: "",
			donorId: "",
			amount: 0,
			tipAmount: 0,
			anonymous: false,
			notes: "",
		});
		setIsCreateModalOpen(true);
	};

	const confirmEdit = () => {
		if (!selectedTransaction) return;

		if (editForm.status === "refunded" && !editForm.refundReason.trim()) {
			toast.error("Refund reason is required for refunded payments.");
			return;
		}

		updateMutation.mutate({
			id: selectedTransaction.paymentId,
			payload: {
				status: editForm.status,
				refundReason: editForm.refundReason || undefined,
			},
		}, {
			onSuccess: () => {
				setIsEditModalOpen(false);
				setSelectedTransaction(null);
			},
		});
	};

	const confirmDelete = () => {
		if (!selectedTransaction) return;

		deleteMutation.mutate(selectedTransaction.paymentId, {
			onSuccess: () => {
				setIsDeleteModalOpen(false);
				setSelectedTransaction(null);
			},
		});
	};

	const confirmCreate = () => {
		if (!createForm.campaignId || createForm.amount <= 0) {
			toast.error("Campaign and valid amount are required.");
			return;
		}

		createMutation.mutate({
			...createForm,
			donorId: createForm.donorId || undefined,
		}, {
			onSuccess: () => {
				setIsCreateModalOpen(false);
			},
		});
	};

	const rawPayments = data?.payments || [];
	const stats = data?.stats;

	const transactions: TransactionRow[] = rawPayments.map((p) => ({
		id: p.transactionUuid || "N/A",
		paymentId: p._id,
		donorName: p.anonymous ? "Anonymous" : (p.donor?.name || "Unknown"),
		campaignTitle: p.campaign?.title || "Unknown Campaign",
		amount: p.amount,
		method: p.gateway || "unknown",
		status: p.status,
		date: p.paidAt || p.createdAt,
	}));

	// Calculate statistics
	const totalRevenue = stats?.totalRevenue || 0;
	const pendingAmount = stats?.pendingAmount || 0;
	const completedCount = stats?.completedCount || 0;
	const averageTransaction = stats?.averageTransaction || 0;

	// Real trend data from backend
	const trends = stats?.trends || { revenue: 0, completedCount: 0, averageTransaction: 0, pendingAmount: 0 };

	const transactionsByMethod = stats?.methodCounts || {};
	const methodsRevenue = stats?.methodRevenue || {};
	const statusCounts = stats?.statusCounts || {};

	const getMethodIcon = (method: string) => {
		switch (method) {
			case "esewa":
				return <Zap size={16} />;
			case "bank_transfer":
				return <Wallet size={16} />;
			case "cash":
				return <DollarSign size={16} />;
			default:
				return <CreditCard size={16} />;
		}
	};

	const getMethodLabel = (method: string) => {
		return method
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	const columns = [
		{
			key: "id" as const,
			label: "Transaction ID",
			sortable: true,
			render: (value: string) => (
				<span className="font-mono text-xs text-setu-600">{value}</span>
			),
		},
		{
			key: "donorName" as const,
			label: "Donor",
			sortable: true,
		},
		{
			key: "campaignTitle" as const,
			label: "Campaign",
			sortable: true,
			render: (value: string) => (
				<span className="text-sm text-setu-700 truncate max-w-xs">{value}</span>
			),
		},
		{
			key: "amount" as const,
			label: "Amount",
			sortable: true,
			render: (value: number) => (
				<span className="font-semibold text-setu-900">
					₨{value.toLocaleString()}
				</span>
			),
		},
		{
			key: "method" as const,
			label: "Payment Method",
			sortable: true,
			render: (value: string) => (
				<div className="flex items-center gap-2">
					<span className="text-setu-500">{getMethodIcon(value)}</span>
					<span className="text-sm text-setu-700">{getMethodLabel(value)}</span>
				</div>
			),
		},
		{
			key: "status" as const,
			label: "Status",
			sortable: true,
			render: (value: string) => {
				const variants: Record<
					string,
					"success" | "warning" | "error" | "pending"
				> = {
					completed: "success",
					pending: "pending",
					failed: "error",
				};
				return (
					<Badge
						variant={variants[value] || "info"}
						size="sm">
						{value.charAt(0).toUpperCase() + value.slice(1)}
					</Badge>
				);
			},
		},
		{
			key: "date" as const,
			label: "Date",
			sortable: true,
			render: (value: string) => (
				<span className="text-sm text-setu-600">
					{new Date(value).toLocaleDateString()}
				</span>
			),
		},
		{
			key: "paymentId" as const,
			label: "Actions",
			render: (_: string, row: TransactionRow) => (
				<div className="flex gap-2">
					<ActionButton
						icon={Eye}
						label="View"
						variant="view"
						size="sm"
						onClick={() => handleViewDetails(row)}
					/>
					<ActionButton
						icon={Edit}
						label="Edit"
						variant="edit"
						size="sm"
						onClick={() => handleEdit(row)}
					/>
					{(row.status === "completed") && (
						<ActionButton
							icon={Trash2}
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
							Transaction Management
						</h1>
						<p className="text-setu-500 mt-2">
							Track all donations and payment transactions
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
						Failed to load transactions.
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
			<div className="flex justify-between items-start">
				<div>
					<h1 className="text-3xl font-display font-bold text-setu-900">
						Transaction Management
					</h1>
					<p className="text-setu-500 mt-2">
						Track all donations and payment transactions
					</p>
				</div>
				<button
					onClick={handleCreate}
					className="px-5 h-10 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors flex items-center gap-2"
				>
					<Plus size={18} />
					Create Manual Payment
				</button>
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
						placeholder="Search transactions by ID, donor, or campaign..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-10 py-2.5 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500 focus:border-transparent transition-all"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-setu-400 hover:text-setu-600 transition-colors"
						>
							<X size={16} />
						</button>
					)}
				</div>
				<div className="text-sm text-setu-500">
					{isLoading ? (
						"Searching..."
					) : (
						<>
							Showing <span className="font-bold text-setu-900">{transactions.length}</span> results
						</>
					)}
				</div>
			</div>

			{/* Key Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<DashboardCard
					title="Total Revenue"
					value={`₨${(totalRevenue / 1000).toFixed(0)}k`}
					icon={DollarSign}
					trend={{ 
						value: Math.abs(trends.revenue), 
						direction: trends.revenue >= 0 ? "up" : "down" 
					}}
					color="setu"
				/>
				<DashboardCard
					title="Pending Amount"
					value={`₨${(pendingAmount / 1000).toFixed(0)}k`}
					icon={AlertCircle}
					trend={{ 
						value: Math.abs(trends.pendingAmount), 
						direction: trends.pendingAmount >= 0 ? "up" : "down" 
					}}
					color="gold"
				/>
				<DashboardCard
					title="Completed Transactions"
					value={isLoading ? "..." : completedCount}
					icon={CheckCircle}
					trend={{ 
						value: Math.abs(trends.completedCount), 
						direction: trends.completedCount >= 0 ? "up" : "down" 
					}}
					color="green"
				/>
				<DashboardCard
					title="Average Transaction"
					value={`₨${averageTransaction.toLocaleString()}`}
					icon={TrendingUp}
					trend={{ 
						value: Math.abs(trends.averageTransaction), 
						direction: trends.averageTransaction >= 0 ? "up" : "down" 
					}}
					color="blue"
				/>
			</div>

			{/* Transaction Breakdown */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<h3 className="text-lg font-semibold text-setu-900 mb-4">
						Payment Methods
					</h3>
					<div className="space-y-3">
						{Object.entries(transactionsByMethod).length === 0 ? (
							<div className="text-sm text-setu-500">No data available</div>
						) : (
							Object.entries(transactionsByMethod).map(([method, count]) => (
								<div key={method} className="flex items-center justify-between p-3 bg-setu-50 rounded-lg border border-setu-100">
									<div className="flex items-center gap-2">
										<span className={`text-${method === "esewa" ? "blue" : "green"}-600`}>
											{getMethodIcon(method)}
										</span>
										<span className={`text-sm font-medium text-${method === "esewa" ? "blue" : "green"}-900`}>
											{getMethodLabel(method)}
										</span>
									</div>
									<span className={`text-lg font-bold text-${method === "esewa" ? "blue" : "green"}-600`}>
										{count}
									</span>
								</div>
							))
						)}
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<h3 className="text-lg font-semibold text-setu-900 mb-4">
						Transaction Status
					</h3>
					<div className="space-y-3">
						<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
							<span className="text-sm font-medium text-green-900">
								Completed
							</span>
							<span className="text-lg font-bold text-green-600">
								{statusCounts["completed"] || 0}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
							<span className="text-sm font-medium text-yellow-900">
								Pending
							</span>
							<span className="text-lg font-bold text-yellow-600">
								{(statusCounts["pending"] || 0) + (statusCounts["initiated"] || 0)}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
							<span className="text-sm font-medium text-red-900">Failed</span>
							<span className="text-lg font-bold text-red-600">
								{statusCounts["failed"] || 0}
							</span>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<h3 className="text-lg font-semibold text-setu-900 mb-4">
						Revenue by Method
					</h3>
					<div className="space-y-3">
						{Object.entries(methodsRevenue).length === 0 ? (
							<div className="text-sm text-setu-500">No data available</div>
						) : (
							Object.entries(methodsRevenue).map(([method, amount]) => (
								<div
									key={method}
									className="flex items-center justify-between p-3 bg-setu-50 rounded-lg border border-setu-100">
									<span className="text-sm font-medium text-setu-700">
										{getMethodLabel(method)}
									</span>
									<span className="font-semibold text-setu-900">
										₨{(amount as number).toLocaleString()}
									</span>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-12 gap-4 bg-white rounded-lg border border-setu-100">
					<div className="w-10 h-10 rounded-full bg-setu-50 border border-setu-100 flex items-center justify-center text-setu-500">
						...
					</div>
					<p className="text-sm text-setu-600 font-medium">Loading transactions...</p>
				</div>
			) : (
				<DataTable
					data={transactions}
					columns={columns}
					searchableFields={["donorName", "campaignTitle", "id"]}
					title="All Transactions"
				/>
			)}

			{/* Transaction Details Modal */}
			<Modal
				isOpen={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
				title="Transaction Details"
				footer={
					<button
						onClick={() => setIsDetailModalOpen(false)}
						className="px-4 py-2 rounded-lg bg-setu-100 text-setu-700 hover:bg-setu-200 font-medium transition-colors">
						Close
					</button>
				}>
				{selectedTransaction && (
					<div className="space-y-4">
						<div className="bg-setu-50 p-4 rounded-lg border border-setu-200">
							<p className="text-xs text-setu-600 uppercase tracking-wide mb-2">
								Transaction ID
							</p>
							<p className="font-mono text-lg text-setu-900">
								{selectedTransaction.id}
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-setu-600">Status</p>
								<Badge
									variant={
										selectedTransaction.status === "completed"
											? "success"
											: selectedTransaction.status === "pending"
												? "pending"
												: "error"
									}
									size="sm"
									className="mt-2">
									{selectedTransaction.status.charAt(0).toUpperCase() +
										selectedTransaction.status.slice(1)}
								</Badge>
							</div>
							<div>
								<p className="text-sm text-setu-600">Payment Method</p>
								<div className="flex items-center gap-2 mt-2">
									<span className="text-setu-500">
										{getMethodIcon(selectedTransaction.method)}
									</span>
									<span className="font-medium text-setu-900">
										{getMethodLabel(selectedTransaction.method)}
									</span>
								</div>
							</div>
						</div>

						<div>
							<p className="text-sm text-setu-600">Amount</p>
							<p className="text-3xl font-bold text-setu-900 mt-2">
								₨{selectedTransaction.amount.toLocaleString()}
							</p>
						</div>

						<div className="border-t border-setu-200 pt-4">
							<h3 className="text-sm font-semibold text-setu-700 uppercase tracking-wide mb-3">
								Donation Details
							</h3>
							<div className="space-y-3">
								<div>
									<p className="text-xs text-setu-600">Donor Name</p>
									<p className="font-medium text-setu-900 mt-1">
										{selectedTransaction.donorName}
									</p>
								</div>
								<div>
									<p className="text-xs text-setu-600">Campaign</p>
									<p className="font-medium text-setu-900 mt-1">
										{selectedTransaction.campaignTitle}
									</p>
								</div>
							</div>
						</div>

						<div className="border-t border-setu-200 pt-4">
							<h3 className="text-sm font-semibold text-setu-700 uppercase tracking-wide mb-3">
								Transaction Info
							</h3>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-sm text-setu-600">Date</span>
									<span className="font-medium text-setu-900">
										{new Date(selectedTransaction.date).toLocaleDateString()}
									</span>
								</div>
								{selectedTransaction.id !== "N/A" && (
									<div className="flex justify-between">
										<span className="text-sm text-setu-600">Transaction UI</span>
										<span className="font-mono text-xs text-setu-600">
											{selectedTransaction.id}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</Modal>

			{/* Edit Transaction Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedTransaction(null);
				}}
				title="Edit Transaction Status"
				footer={
					<div className="flex gap-3 justify-end">
						<button
							onClick={() => {
								setIsEditModalOpen(false);
								setSelectedTransaction(null);
							}}
							className="px-4 py-2 rounded-lg border border-setu-200 text-setu-700 hover:bg-setu-50 font-medium transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={confirmEdit}
							disabled={updateMutation.isPending}
							className="px-4 py-2 rounded-lg bg-setu-600 text-white hover:bg-setu-700 font-medium transition-colors disabled:opacity-50"
						>
							{updateMutation.isPending ? "Updating..." : "Update Status"}
						</button>
					</div>
				}
			>
				{selectedTransaction && (
					<div className="space-y-4">
						<div className="bg-setu-50 p-4 rounded-lg border border-setu-200">
							<p className="text-sm font-medium text-setu-900 mb-1">Transaction: {selectedTransaction.id}</p>
							<p className="text-sm text-setu-600">Current Status: <span className="font-medium">{selectedTransaction.status}</span></p>
						</div>

						<div>
							<label className="block text-sm font-medium text-setu-700 mb-2">New Status</label>
							<select
								value={editForm.status}
								onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value as UpdatePaymentStatusPayload["status"] }))}
								className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
							>
								<option value="initiated">Initiated</option>
								<option value="pending">Pending</option>
								<option value="completed">Completed</option>
								<option value="failed">Failed</option>
								<option value="refunded">Refunded</option>
							</select>
						</div>

						{editForm.status === "refunded" && (
							<div>
								<label className="block text-sm font-medium text-setu-700 mb-2">Refund Reason *</label>
								<textarea
									value={editForm.refundReason}
									onChange={(e) => setEditForm(f => ({ ...f, refundReason: e.target.value }))}
									placeholder="Enter the reason for refund..."
									className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
									rows={3}
								/>
							</div>
						)}

						{editForm.status === "completed" && selectedTransaction.status !== "completed" && (
							<div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
								<p className="text-sm text-yellow-800">
									<strong>Warning:</strong> Marking as completed will update campaign raised amount and donor statistics.
								</p>
							</div>
						)}
					</div>
				)}
			</Modal>

			{/* Create Manual Payment Modal */}
			<Modal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				title="Create Manual Payment"
				size="lg"
				footer={
					<div className="flex gap-3 justify-end">
						<button
							onClick={() => setIsCreateModalOpen(false)}
							className="px-4 py-2 rounded-lg border border-setu-200 text-setu-700 hover:bg-setu-50 font-medium transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={confirmCreate}
							disabled={createMutation.isPending}
							className="px-4 py-2 rounded-lg bg-setu-600 text-white hover:bg-setu-700 font-medium transition-colors disabled:opacity-50"
						>
							{createMutation.isPending ? "Creating..." : "Create Payment"}
						</button>
					</div>
				}
			>
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-setu-700 mb-2">Campaign *</label>
							<select
								value={createForm.campaignId}
								onChange={(e) => setCreateForm(f => ({ ...f, campaignId: e.target.value }))}
								className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
							>
								<option value="">Select Campaign</option>
								{campaigns.map((campaign) => (
									<option key={campaign._id} value={campaign._id}>
										{campaign.title}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-setu-700 mb-2">Donor (Optional)</label>
							<select
								value={createForm.donorId}
								onChange={(e) => setCreateForm(f => ({ ...f, donorId: e.target.value }))}
								className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
							>
								<option value="">Anonymous Donation</option>
								{users.map((user) => (
									<option key={user._id} value={user._id}>
										{user.name} ({user.email})
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-setu-700 mb-2">Amount *</label>
							<input
								type="number"
								min="10"
								value={createForm.amount}
								onChange={(e) => setCreateForm(f => ({ ...f, amount: Number(e.target.value) }))}
								className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
								placeholder="Enter amount"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-setu-700 mb-2">Tip Amount</label>
							<input
								type="number"
								min="0"
								value={createForm.tipAmount}
								onChange={(e) => setCreateForm(f => ({ ...f, tipAmount: Number(e.target.value) }))}
								className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
								placeholder="Enter tip amount"
							/>
						</div>
					</div>

					<div>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={createForm.anonymous}
								onChange={(e) => setCreateForm(f => ({ ...f, anonymous: e.target.checked }))}
								className="w-4 h-4 text-setu-600 border-setu-300 rounded focus:ring-setu-500"
							/>
							<span className="text-sm text-setu-700">Anonymous donation</span>
						</label>
					</div>

					<div>
						<label className="block text-sm font-medium text-setu-700 mb-2">Notes</label>
						<textarea
							value={createForm.notes}
							onChange={(e) => setCreateForm(f => ({ ...f, notes: e.target.value }))}
							placeholder="Add any notes about this manual payment..."
							className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
							rows={3}
						/>
					</div>

					<div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
						<p className="text-sm text-blue-800">
							<strong>Note:</strong> Manual payments are immediately marked as completed and will update campaign statistics.
						</p>
					</div>
				</div>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedTransaction(null);
				}}
				title="Delete Transaction"
				footer={
					<div className="flex gap-3 justify-end">
						<button
							onClick={() => {
								setIsDeleteModalOpen(false);
								setSelectedTransaction(null);
							}}
							className="px-4 py-2 rounded-lg border border-setu-200 text-setu-700 hover:bg-setu-50 font-medium transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={confirmDelete}
							disabled={deleteMutation.isPending}
							className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
						>
							{deleteMutation.isPending ? "Deleting..." : "Delete"}
						</button>
					</div>
				}
			>
				{selectedTransaction && (
					<div className="space-y-4">
						<div className="bg-red-50 border border-red-200 p-4 rounded-lg">
							<div className="flex items-start gap-3">
								<AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
								<div>
									<p className="font-semibold text-red-800 mb-1">Confirm Deletion</p>
									<p className="text-sm text-red-700">
										Are you sure you want to delete this transaction? This action cannot be undone.
									</p>
								</div>
							</div>
						</div>

						<div className="bg-setu-50 p-4 rounded-lg border border-setu-200">
							<p className="text-sm font-medium text-setu-900 mb-2">Transaction Details:</p>
							<div className="space-y-1 text-sm text-setu-600">
								<p><strong>ID:</strong> {selectedTransaction.id}</p>
								<p><strong>Donor:</strong> {selectedTransaction.donorName}</p>
								<p><strong>Campaign:</strong> {selectedTransaction.campaignTitle}</p>
								<p><strong>Amount:</strong> ₨{selectedTransaction.amount.toLocaleString()}</p>
								<p><strong>Status:</strong> {selectedTransaction.status}</p>
							</div>
						</div>

						{selectedTransaction.status === "completed" && (
							<div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
								<p className="text-sm text-yellow-800">
									<strong>Warning:</strong> Cannot delete completed payments. Use refund instead.
								</p>
							</div>
						)}
					</div>
				)}
			</Modal>
		</div>
	);
}
