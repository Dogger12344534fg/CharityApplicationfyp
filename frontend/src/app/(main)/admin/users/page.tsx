"use client";

import { useState } from "react";
import { 
	Mail, Phone, Eye, Users2, DollarSign, TrendingUp, 
	Search, X, Ban, Play, Edit, Trash2, AlertCircle 
} from "lucide-react";
import DataTable from "@/src/components/dashboard/DataTable";
import Badge from "@/src/components/dashboard/Badge";
import ActionButton from "@/src/components/dashboard/ActionButton";
import Modal from "@/src/components/dashboard/Modal";
import StatCard from "@/src/components/dashboard/StatCard";
import { 
	useGetAllUsersAdmin, 
	useGetDonorStatsAdmin, 
	useUpdateUserStatusAdmin, 
	useUpdateUserProfile,
	useDeleteUser,
	User,
	type UpdateUserProfilePayload 
} from "@/src/hooks/useUser";
import { useDebounce } from "@/src/hooks/useDebounce";
import { toast } from "sonner";

export default function UsersPage() {
	const [selectedDonor, setSelectedDonor] = useState<User | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isActionModalOpen, setIsActionModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [actionType, setActionType] = useState<"suspend" | "unsuspend" | null>(null);

	// Edit form state
	const [editForm, setEditForm] = useState<UpdateUserProfilePayload>({
		name: "",
		phone: "",
		accountType: "individual",
		status: "active",
	});

	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearch = useDebounce(searchQuery, 500);

	const { data: usersData, isLoading: usersLoading } = useGetAllUsersAdmin({
		page: 1,
		limit: 100,
		search: debouncedSearch || undefined,
	});	
	const { data: statsData } = useGetDonorStatsAdmin();
	const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatusAdmin();
	const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateUserProfile();
	const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

	const donors = usersData?.data.users || [];
	const stats = statsData?.data || { totalDonors: 0, totalDonated: 0, totalDonations: 0 };

	const totalDonated = stats.totalDonated;
	const averageDonation = stats.totalDonations > 0 ? Math.round(stats.totalDonated / stats.totalDonations) : 0;

	const handleViewDetails = (donor: User) => {
		setSelectedDonor(donor);
		setIsDetailModalOpen(true);
	};

	const handleEdit = (donor: User) => {
		setSelectedDonor(donor);
		setEditForm({
			name: donor.name,
			phone: donor.phone || "",
			accountType: donor.accountType,
			status: donor.status,
		});
		setIsEditModalOpen(true);
	};

	const handleDelete = (donor: User) => {
		setSelectedDonor(donor);
		setIsDeleteModalOpen(true);
	};

	const handleAction = (donor: User, type: "suspend" | "unsuspend") => {
		setSelectedDonor(donor);
		setActionType(type);
		setIsActionModalOpen(true);
	};

	const confirmAction = () => {
		if (!selectedDonor || !actionType) return;

		const newStatus = actionType === "suspend" ? "suspended" : "active";
		updateStatus({ id: selectedDonor._id, status: newStatus });

		setIsActionModalOpen(false);
		setSelectedDonor(null);
		setActionType(null);
	};

	const confirmEdit = () => {
		if (!selectedDonor) return;

		if (!editForm.name?.trim()) {
			toast.error("Name is required.");
			return;
		}

		updateProfile({
			id: selectedDonor._id,
			data: editForm,
		}, {
			onSuccess: () => {
				setIsEditModalOpen(false);
				setSelectedDonor(null);
			},
		});
	};

	const confirmDelete = () => {
		if (!selectedDonor) return;

		deleteUser(selectedDonor._id, {
			onSuccess: () => {
				setIsDeleteModalOpen(false);
				setSelectedDonor(null);
			},
		});
	};

	const columns = [
		{
			key: "name" as const,
			label: "Donor Name",
			sortable: true,
		},
		{
			key: "accountType" as const,
			label: "Type",
			sortable: true,
			render: (value: string) => (
				<Badge
					variant={value === "organization" ? "info" : "success"}
					size="sm">
					{value ? value.charAt(0).toUpperCase() + value.slice(1).replace("_", " ") : "Individual"}
				</Badge>
			),
		},
		{
			key: "totalDonated" as const,
			label: "Total Donated",
			sortable: true,
			render: (value: number) => (
				<span className="font-semibold text-setu-900">
					Rs. {value.toLocaleString()}
				</span>
			),
		},
		{
			key: "donationsCount" as const,
			label: "Donations",
			sortable: true,
			render: (value: number) => (
				<span className="font-medium text-setu-700">{value}</span>
			),
		},
		{
			key: "status" as const,
			label: "Status",
			sortable: true,
			render: (value: string) => (
				<Badge
					variant={value === "active" ? "success" : "warning"}
					size="sm">
					{value.charAt(0).toUpperCase() + value.slice(1)}
				</Badge>
			),
		},
		{
			key: "createdAt" as const,
			label: "Joined Date",
			sortable: true,
			render: (value: string) => (
				<span className="text-sm text-setu-600">
					{value ? new Date(value).toLocaleDateString() : "N/A"}
				</span>
			),
		},
		{
			key: "_id" as const,
			label: "Actions",
			render: (_: string, row: User) => (
				<div className="flex gap-2">
					<ActionButton
						icon={Eye}
						label="View"
						variant="view"
						size="sm"
						onClick={() => handleViewDetails(row)}
					/>
					{row.role !== "admin" && (
						<ActionButton
							icon={Edit}
							label="Edit"
							variant="edit"
							size="sm"
							onClick={() => handleEdit(row)}
						/>
					)}
					{row.status === "active" && row.role !== "admin" && (
						<ActionButton
							icon={Ban}
							label="Suspend"
							variant="reject"
							size="sm"
							onClick={() => handleAction(row, "suspend")}
						/>
					)}
					{row.status === "suspended" && (
						<ActionButton
							icon={Play}
							label="Unsuspend"
							variant="approve"
							size="sm"
							onClick={() => handleAction(row, "unsuspend")}
						/>
					)}
					{row.role !== "admin" && row.status !== "active" && (
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

	return (
		<div className="space-y-6 animate-fade-in-up">
			<div>
				<h1 className="text-3xl font-display font-bold text-setu-900">
					Users & Donors
				</h1>
				<p className="text-setu-500 mt-2">
					Manage and track all donor accounts and activities
				</p>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<StatCard
						label="Total Donors"
						value={donors.length}
						icon={<span className="text-2xl"><Users2 /></span>}
					/>
				</div>
				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<StatCard
						label="Total Donated"
						value={totalDonated}
						format="currency"
						icon={<span className="text-2xl"><DollarSign /></span>}
					/>
				</div>
				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<StatCard
						label="Average Donation"
						value={averageDonation}
						format="currency"
						icon={<span className="text-2xl"><TrendingUp /></span>}
					/>
				</div>
			</div>

			{/* Donor Statistics */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border border-setu-100">
					<p className="text-sm text-setu-600 mb-1">Active Donors</p>
					<p className="text-2xl font-bold text-green-600">
						{donors.filter((d) => d.status === "active").length}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg border border-setu-100">
					<p className="text-sm text-setu-600 mb-1">Inactive</p>
					<p className="text-2xl font-bold text-yellow-600">
						{donors.filter((d) => d.status === "inactive").length}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg border border-setu-100">
					<p className="text-sm text-setu-600 mb-1">Organizations</p>
					<p className="text-2xl font-bold text-blue-600">
						{donors.filter((d) => d.accountType === "organization").length}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg border border-setu-100">
					<p className="text-sm text-setu-600 mb-1">Individuals</p>
					<p className="text-2xl font-bold text-purple-600">
						{donors.filter((d) => !d.accountType || d.accountType === "individual").length}
					</p>
				</div>
			</div>

			{/* Search Bar */}
			<div className="flex justify-between items-center bg-white p-4 rounded-xl border border-setu-100 shadow-sm mt-4 mb-2">
				<div className="relative flex-1 max-w-md">
					<Search
						size={18}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-setu-400"
					/>
					<input
						type="text"
						placeholder="Search donors by name or email..."
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
					{usersLoading ? (
						"Searching..."
					) : (
						<>
							Showing{" "}
							<span className="font-bold text-setu-900">
								{donors.length}
							</span>{" "}
							results
						</>
					)}
				</div>
			</div>

			{/* Donors Table */}
			{usersLoading ? (
				<div className="flex flex-col items-center justify-center py-12 gap-4 bg-white rounded-lg border border-setu-100">
					<div className="w-10 h-10 border-4 border-setu-200 border-t-setu-600 rounded-full animate-spin" />
					<p className="text-sm text-setu-600 font-medium">Loading donors...</p>
				</div>
			) : (
				<DataTable
					data={donors}
					columns={columns}
					title="All Donors"
				/>
			)}

			{/* Donor Details Modal */}
			<Modal
				isOpen={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
				title="Donor Profile"
				footer={
					<button
						onClick={() => setIsDetailModalOpen(false)}
						className="px-4 py-2 rounded-lg bg-setu-100 text-setu-700 hover:bg-setu-200 font-medium transition-colors">
						Close
					</button>
				}>
				{selectedDonor && (
					<div className="space-y-5">
						{/* Personal Information */}
						<div>
							<h3 className="text-sm font-semibold text-setu-700 uppercase tracking-wide mb-4">
								Personal Information
							</h3>
							<div className="space-y-3">
								<div>
									<p className="text-xs text-setu-600 uppercase">Name</p>
									<p className="text-lg font-semibold text-setu-900 mt-1">
										{selectedDonor.name}
									</p>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-xs text-setu-600 uppercase">Type</p>
										<Badge
											variant={
												selectedDonor.accountType === "organization"
													? "info"
													: "success"
											}
											size="sm"
											className="mt-1">
											{selectedDonor.accountType ? selectedDonor.accountType.charAt(0).toUpperCase() +
												selectedDonor.accountType.slice(1).replace("_", " ") : "Individual"}
										</Badge>
									</div>
									<div>
										<p className="text-xs text-setu-600 uppercase">Status</p>
										<Badge
											variant={
												selectedDonor.status === "active"
													? "success"
													: "warning"
											}
											size="sm"
											className="mt-1">
											{selectedDonor.status.charAt(0).toUpperCase() +
												selectedDonor.status.slice(1)}
										</Badge>
									</div>
								</div>
							</div>
						</div>

						{/* Contact Information */}
						<div>
							<h3 className="text-sm font-semibold text-setu-700 uppercase tracking-wide mb-4">
								Contact Information
							</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<Mail
										size={18}
										className="text-setu-500"
									/>
									<div>
										<p className="text-xs text-setu-600 uppercase">Email</p>
										<p className="text-sm text-setu-900">
											{selectedDonor.email}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Phone
										size={18}
										className="text-setu-500"
									/>
									<div>
										<p className="text-xs text-setu-600 uppercase">Phone</p>
										<p className="text-sm text-setu-900">
											{selectedDonor.phone || "N/A"}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Donation Statistics */}
						<div>
							<h3 className="text-sm font-semibold text-setu-700 uppercase tracking-wide mb-4">
								Donation Statistics
							</h3>
							<div className="grid grid-cols-3 gap-3">
								<div className="bg-setu-50 p-3 rounded-lg">
									<p className="text-xs text-setu-600 mb-1">Total Donated</p>
									<p className="text-lg font-bold text-setu-900">
										Rs. {selectedDonor.totalDonated.toLocaleString()}
									</p>
								</div>
								<div className="bg-green-50 p-3 rounded-lg">
									<p className="text-xs text-green-600 mb-1">Donations</p>
									<p className="text-lg font-bold text-green-900">
										{selectedDonor.donationsCount}
									</p>
								</div>
								<div className="bg-blue-50 p-3 rounded-lg">
									<p className="text-xs text-blue-600 mb-1">Avg Donation</p>
									<p className="text-lg font-bold text-blue-900">
										Rs. 
										{selectedDonor.donationsCount > 0 ? Math.round(
											selectedDonor.totalDonated / selectedDonor.donationsCount,
										).toLocaleString() : 0}
									</p>
								</div>
							</div>
						</div>

						{/* Dates */}
						<div>
							<h3 className="text-sm font-semibold text-setu-700 uppercase tracking-wide mb-4">
								Activity Timeline
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-setu-50 p-3 rounded-lg">
									<p className="text-xs text-setu-600 uppercase">Joined Date</p>
									<p className="text-sm font-medium text-setu-900 mt-1">
										{selectedDonor.createdAt ? new Date(selectedDonor.createdAt).toLocaleDateString() : "N/A"}
									</p>
								</div>
								<div className="bg-green-50 p-3 rounded-lg">
									<p className="text-xs text-green-600 uppercase">
										Last Donation Month
									</p>
									<p className="text-sm font-medium text-green-900 mt-1">
										{selectedDonor.lastDonationMonth || "Never"}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</Modal>

			<Modal
				isOpen={isActionModalOpen}
				onClose={() => {
					setIsActionModalOpen(false);
					setSelectedDonor(null);
				}}
				title={actionType === "suspend" ? "Suspend User" : "Unsuspend User"}
				footer={
					<div className="flex gap-3 justify-end">
						<button
							onClick={() => {
								setIsActionModalOpen(false);
								setSelectedDonor(null);
							}}
							className="px-4 py-2 rounded-lg border border-setu-200 text-setu-700 hover:bg-setu-50 font-medium transition-colors">
							Cancel
						</button>
						<button
							onClick={confirmAction}
							disabled={isUpdating}
							className={`px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-60 ${
								actionType === "suspend" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
							}`}>
							{isUpdating ? "Processing..." : "Confirm"}
						</button>
					</div>
				}>
				<div className="space-y-4">
					<p className="text-setu-700">
						{actionType === "suspend"
							? `Are you sure you want to suspend ${selectedDonor?.name}? They will not be able to log in or create campaigns.`
							: `Are you sure you want to reactivate ${selectedDonor?.name}? They will regain full access to their account.`}
					</p>
					<div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
						<p className="text-sm text-yellow-800">
							{actionType === "suspend"
								? "This action is reversible. You can unsuspend the user at any time."
								: "The user will be immediately restored."}
						</p>
					</div>
				</div>
			</Modal>

			{/* Edit User Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedDonor(null);
				}}
				title="Edit User Profile"
				footer={
					<div className="flex gap-3 justify-end">
						<button
							onClick={() => {
								setIsEditModalOpen(false);
								setSelectedDonor(null);
							}}
							className="px-4 py-2 rounded-lg border border-setu-200 text-setu-700 hover:bg-setu-50 font-medium transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={confirmEdit}
							disabled={isUpdatingProfile}
							className="px-4 py-2 rounded-lg bg-setu-600 text-white hover:bg-setu-700 font-medium transition-colors disabled:opacity-50"
						>
							{isUpdatingProfile ? "Updating..." : "Update Profile"}
						</button>
					</div>
				}
			>
				{selectedDonor && (
					<div className="space-y-4">
						<div className="bg-setu-50 p-4 rounded-lg border border-setu-200">
							<p className="text-sm font-medium text-setu-900 mb-1">Editing: {selectedDonor.name}</p>
							<p className="text-sm text-setu-600">Email: {selectedDonor.email}</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-setu-700 mb-2">Name *</label>
								<input
									type="text"
									value={editForm.name}
									onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
									className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
									placeholder="Enter full name"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-setu-700 mb-2">Phone</label>
								<input
									type="tel"
									value={editForm.phone}
									onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
									className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
									placeholder="Enter phone number"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-setu-700 mb-2">Account Type</label>
								<select
									value={editForm.accountType}
									onChange={(e) => setEditForm(f => ({ ...f, accountType: e.target.value as "individual" | "organization" }))}
									className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
								>
									<option value="individual">Individual</option>
									<option value="organization">Organization</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-setu-700 mb-2">Status</label>
								<select
									value={editForm.status}
									onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value as "active" | "inactive" | "suspended" }))}
									className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
								>
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
									<option value="suspended">Suspended</option>
								</select>
							</div>
						</div>

						<div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
							<p className="text-sm text-blue-800">
								<strong>Note:</strong> Email and donation statistics cannot be modified through this interface.
							</p>
						</div>
					</div>
				)}
			</Modal>

			{/* Delete User Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedDonor(null);
				}}
				title="Delete User"
				footer={
					<div className="flex gap-3 justify-end">
						<button
							onClick={() => {
								setIsDeleteModalOpen(false);
								setSelectedDonor(null);
							}}
							className="px-4 py-2 rounded-lg border border-setu-200 text-setu-700 hover:bg-setu-50 font-medium transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={confirmDelete}
							disabled={isDeleting}
							className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
						>
							{isDeleting ? "Deleting..." : "Delete User"}
						</button>
					</div>
				}
			>
				{selectedDonor && (
					<div className="space-y-4">
						<div className="bg-red-50 border border-red-200 p-4 rounded-lg">
							<div className="flex items-start gap-3">
								<AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
								<div>
									<p className="font-semibold text-red-800 mb-1">Confirm User Deletion</p>
									<p className="text-sm text-red-700">
										Are you sure you want to delete this user? This action cannot be undone.
									</p>
								</div>
							</div>
						</div>

						<div className="bg-setu-50 p-4 rounded-lg border border-setu-200">
							<p className="text-sm font-medium text-setu-900 mb-2">User Details:</p>
							<div className="space-y-1 text-sm text-setu-600">
								<p><strong>Name:</strong> {selectedDonor.name}</p>
								<p><strong>Email:</strong> {selectedDonor.email}</p>
								<p><strong>Account Type:</strong> {selectedDonor.accountType || "Individual"}</p>
								<p><strong>Total Donated:</strong> Rs. {selectedDonor.totalDonated.toLocaleString()}</p>
								<p><strong>Donations Count:</strong> {selectedDonor.donationsCount}</p>
								<p><strong>Status:</strong> {selectedDonor.status}</p>
							</div>
						</div>

						{selectedDonor.role === "admin" && (
							<div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
								<p className="text-sm text-yellow-800">
									<strong>Warning:</strong> Cannot delete admin users for security reasons.
								</p>
							</div>
						)}

						{selectedDonor.totalDonated > 0 && (
							<div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
								<p className="text-sm text-yellow-800">
									<strong>Note:</strong> This user has made donations. Deletion will preserve donation records but remove user access.
								</p>
							</div>
						)}

						<div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
							<p className="text-sm text-gray-700">
								<strong>What happens when you delete:</strong>
							</p>
							<ul className="text-sm text-gray-600 mt-1 ml-4 list-disc">
								<li>User account will be permanently disabled</li>
								<li>User cannot log in or access the platform</li>
								<li>Donation history will be preserved for audit purposes</li>
								<li>Any active campaigns must be handled separately</li>
							</ul>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
