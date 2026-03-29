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
} from "lucide-react";
import DataTable from "@/src/components/dashboard/DataTable";
import Badge from "@/src/components/dashboard/Badge";
import { ActionButton } from "@/src/components/dashboard/ActionButton";
import Modal from "@/src/components/dashboard/Modal";
import DashboardCard from "@/src/components/dashboard/DashboardCard";
import { mockTransactions, Transaction } from "@/lib/mockData";

export default function TransactionsPage() {
	const [transactions] = useState(mockTransactions);
	const [selectedTransaction, setSelectedTransaction] =
		useState<Transaction | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

	const handleViewDetails = (transaction: Transaction) => {
		setSelectedTransaction(transaction);
		setIsDetailModalOpen(true);
	};

	// Calculate statistics
	const completedTransactions = transactions.filter(
		(t) => t.status === "completed",
	);
	const totalRevenue = completedTransactions.reduce(
		(sum, t) => sum + t.amount,
		0,
	);
	const pendingAmount = transactions
		.filter((t) => t.status === "pending")
		.reduce((sum, t) => sum + t.amount, 0);
	const averageTransaction =
		completedTransactions.length > 0
			? Math.round(totalRevenue / completedTransactions.length)
			: 0;

	// Group transactions by method
	const transactionsByMethod = {
		esewa: transactions.filter((t) => t.method === "esewa").length,
		bank_transfer: transactions.filter((t) => t.method === "bank_transfer")
			.length,
		cash: transactions.filter((t) => t.method === "cash").length,
	};

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
			key: "id1" as const,
			label: "Actions",
			render: (_: string, row: Transaction) => (
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
					Transaction Management
				</h1>
				<p className="text-setu-500 mt-2">
					Track all donations and payment transactions
				</p>
			</div>

			{/* Key Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<DashboardCard
					title="Total Revenue"
					value={`₨${(totalRevenue / 1000).toFixed(0)}k`}
					icon={DollarSign}
					trend={{ value: 15, direction: "up" }}
					color="setu"
				/>
				<DashboardCard
					title="Pending Amount"
					value={`₨${(pendingAmount / 1000).toFixed(0)}k`}
					icon={AlertCircle}
					trend={{ value: 5, direction: "down" }}
					color="gold"
				/>
				<DashboardCard
					title="Completed Transactions"
					value={completedTransactions.length}
					icon={CheckCircle}
					trend={{ value: 8, direction: "up" }}
					color="green"
				/>
				<DashboardCard
					title="Average Transaction"
					value={`₨${averageTransaction.toLocaleString()}`}
					icon={TrendingUp}
					trend={{ value: 3, direction: "up" }}
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
						<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
							<div className="flex items-center gap-2">
								<Zap
									size={18}
									className="text-blue-600"
								/>
								<span className="text-sm font-medium text-blue-900">eSewa</span>
							</div>
							<span className="text-lg font-bold text-blue-600">
								{transactionsByMethod.esewa}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
							<div className="flex items-center gap-2">
								<Wallet
									size={18}
									className="text-green-600"
								/>
								<span className="text-sm font-medium text-green-900">
									Bank Transfer
								</span>
							</div>
							<span className="text-lg font-bold text-green-600">
								{transactionsByMethod.bank_transfer}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
							<div className="flex items-center gap-2">
								<DollarSign
									size={18}
									className="text-yellow-600"
								/>
								<span className="text-sm font-medium text-yellow-900">
									Cash
								</span>
							</div>
							<span className="text-lg font-bold text-yellow-600">
								{transactionsByMethod.cash}
							</span>
						</div>
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
								{completedTransactions.length}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
							<span className="text-sm font-medium text-yellow-900">
								Pending
							</span>
							<span className="text-lg font-bold text-yellow-600">
								{transactions.filter((t) => t.status === "pending").length}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
							<span className="text-sm font-medium text-red-900">Failed</span>
							<span className="text-lg font-bold text-red-600">
								{transactions.filter((t) => t.status === "failed").length}
							</span>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-setu-100 shadow-sm">
					<h3 className="text-lg font-semibold text-setu-900 mb-4">
						Revenue by Method
					</h3>
					<div className="space-y-3">
						{Object.entries(transactionsByMethod).map(([method, count]) => {
							const methodTotal = transactions
								.filter((t) => t.method === method && t.status === "completed")
								.reduce((sum, t) => sum + t.amount, 0);
							return (
								<div
									key={method}
									className="flex items-center justify-between p-3 bg-setu-50 rounded-lg">
									<span className="text-sm font-medium text-setu-700">
										{getMethodLabel(method)}
									</span>
									<span className="font-semibold text-setu-900">
										₨{methodTotal.toLocaleString()}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Transactions Table */}
			<DataTable
				data={transactions}
				columns={columns}
				searchableFields={["donorName", "campaignTitle", "id"]}
				title="All Transactions"
			/>

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
								{selectedTransaction.transactionHash && (
									<div className="flex justify-between">
										<span className="text-sm text-setu-600">Hash</span>
										<span className="font-mono text-xs text-setu-600">
											{selectedTransaction.transactionHash}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
