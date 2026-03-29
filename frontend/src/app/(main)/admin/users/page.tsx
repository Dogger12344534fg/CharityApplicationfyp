"use client";

import { useState } from "react";
import { Mail, Phone, Eye } from "lucide-react";
import DataTable from "@/src/components/dashboard/DataTable";
import Badge from "@/src/components/dashboard/Badge";
import ActionButton from "@/src/components/dashboard/ActionButton";
import Modal from "@/src/components/dashboard/Modal";
import StatCard from "@/src/components/dashboard/StatCard";
import { mockDonors, Donor } from "@/lib/mockData";

export default function UsersPage() {
	const [donors, setDonors] = useState(mockDonors);
	const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

	const handleViewDetails = (donor: Donor) => {
		setSelectedDonor(donor);
		setIsDetailModalOpen(true);
	};

	const totalDonated = donors.reduce((sum, d) => sum + d.totalDonated, 0);
	const averageDonation =
		donors.length > 0
			? Math.round(
					donors.reduce((sum, d) => sum + d.totalDonated, 0) /
						donors.reduce((sum, d) => sum + d.donationCount, 0),
				)
			: 0;

	const columns = [
		{
			key: "name" as const,
			label: "Donor Name",
			sortable: true,
		},
		{
			key: "role" as const,
			label: "Type",
			sortable: true,
			render: (value: string) => (
				<Badge
					variant={value === "organization" ? "info" : "success"}
					size="sm">
					{value.charAt(0).toUpperCase() + value.slice(1).replace("_", " ")}
				</Badge>
			),
		},
		{
			key: "totalDonated" as const,
			label: "Total Donated",
			sortable: true,
			render: (value: number) => (
				<span className="font-semibold text-setu-900">
					₨{value.toLocaleString()}
				</span>
			),
		},
		{
			key: "donationCount" as const,
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
			key: "lastDonationDate" as const,
			label: "Last Donation",
			sortable: true,
			render: (value: string) => (
				<span className="text-sm text-setu-600">
					{new Date(value).toLocaleDateString()}
				</span>
			),
		},
		{
			key: "id" as const,
			label: "Actions",
			render: (_: string, row: Donor) => (
				<ActionButton
					icon={Eye}
					label="View"
					variant="view"
					size="sm"
					onClick={() => handleViewDetails(row)}
				/>
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
						icon={<span className="text-2xl">👥</span>}
					/>
				</div>
				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<StatCard
						label="Total Donated"
						value={totalDonated}
						format="currency"
						icon={<span className="text-2xl">💰</span>}
					/>
				</div>
				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<StatCard
						label="Average Donation"
						value={averageDonation}
						format="currency"
						icon={<span className="text-2xl">📊</span>}
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
						{donors.filter((d) => d.role === "organization").length}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg border border-setu-100">
					<p className="text-sm text-setu-600 mb-1">Individuals</p>
					<p className="text-2xl font-bold text-purple-600">
						{donors.filter((d) => d.role === "individual").length}
					</p>
				</div>
			</div>

			{/* Donors Table */}
			<DataTable
				data={donors}
				columns={columns}
				searchableFields={["name", "email"]}
				title="All Donors"
			/>

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
												selectedDonor.role === "organization"
													? "info"
													: "success"
											}
											size="sm"
											className="mt-1">
											{selectedDonor.role.charAt(0).toUpperCase() +
												selectedDonor.role.slice(1).replace("_", " ")}
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
											{selectedDonor.phone}
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
										₨{selectedDonor.totalDonated.toLocaleString()}
									</p>
								</div>
								<div className="bg-green-50 p-3 rounded-lg">
									<p className="text-xs text-green-600 mb-1">Donations</p>
									<p className="text-lg font-bold text-green-900">
										{selectedDonor.donationCount}
									</p>
								</div>
								<div className="bg-blue-50 p-3 rounded-lg">
									<p className="text-xs text-blue-600 mb-1">Avg Donation</p>
									<p className="text-lg font-bold text-blue-900">
										₨
										{Math.round(
											selectedDonor.totalDonated / selectedDonor.donationCount,
										).toLocaleString()}
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
										{new Date(selectedDonor.joinedDate).toLocaleDateString()}
									</p>
								</div>
								<div className="bg-green-50 p-3 rounded-lg">
									<p className="text-xs text-green-600 uppercase">
										Last Donation
									</p>
									<p className="text-sm font-medium text-green-900 mt-1">
										{new Date(
											selectedDonor.lastDonationDate,
										).toLocaleDateString()}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
