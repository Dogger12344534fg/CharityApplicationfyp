"use client";

import { useState } from "react";
import { Package, BarChart3, CheckCircle, Truck, Van } from "lucide-react";
import { mockGoods, GoodRow } from "@/lib/mockData";
import { DataTable } from "@/src/components/dashboard/DataTable";
import { DashboardCard } from "@/src/components/dashboard/DashboardCard";
import { Badge } from "@/src/components//dashboard/Badge";
import { ActionButton } from "@/src/components/dashboard/ActionButton";
import { Modal } from "@/src/components/dashboard/Modal";

export default function GoodsPage() {
	const [selectedGood, setSelectedGood] = useState<GoodRow | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState<
		"all" | "available" | "distributed" | "damaged"
	>("all");
	const [sortBy, setSortBy] = useState<"name" | "quantity" | "date">("name");

	const goodRows: GoodRow[] = mockGoods.map((good) => ({
		id: good.id,
		name: good.name,
		category: good.category,
		quantity: good.quantity,
		unit: good.unit,
		condition: good.condition as any,
		location: good.location,
		donor: good.donor,
		dateReceived: new Date(good.dateReceived).toLocaleDateString(),
		status: good.status as any,
	}));

	const filteredGoods = goodRows
		.filter((good) => {
			const matchesSearch =
				good.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				good.category.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus =
				filterStatus === "all" || good.status === filterStatus;
			return matchesSearch && matchesStatus;
		})
		.sort((a, b) => {
			if (sortBy === "name") return a.name.localeCompare(b.name);
			if (sortBy === "quantity") return b.quantity - a.quantity;
			if (sortBy === "date")
				return (
					new Date(b.dateReceived).getTime() -
					new Date(a.dateReceived).getTime()
				);
			return 0;
		});

	const handleEdit = (good: GoodRow) => {
		setSelectedGood(good);
		setShowModal(true);
	};

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this item?")) {
			console.log("Deleted good:", id);
		}
	};

	const totalQuantity = goodRows.reduce((sum, g) => sum + g.quantity, 0);
	const availableGoods = goodRows.filter(
		(g) => g.status === "available",
	).length;
	const distributedGoods = goodRows.filter(
		(g) => g.status === "distributed",
	).length;

	const inStockCount = goodRows.filter((g) => g.status === "available").length;
	const inTransitCount = goodRows.filter(
		(g) => g.status === "distributed",
	).length;
	return (
		<div className="space-y-8 pb-8">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold font-display text-setu-950 mb-2">
						Relief Goods
					</h1>
					<p className="text-setu-600">Manage donated goods and supplies</p>
				</div>
				<button className="px-6 py-3 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
					+ Add Good
				</button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<DashboardCard
					title="Total Items"
					value={goodRows.length}
					subtitle="relief goods"
					icon={Package}
					color="setu"
					trend={{ value: 8, direction: "up" }}
				/>
				<DashboardCard
					title="Distribution Rate"
					value="65%"
					subtitle="distributed"
					icon={BarChart3}
					color="setu"
					trend={{ value: 5, direction: "down" }}
				/>
				<DashboardCard
					title="In Stock"
					value={inStockCount}
					subtitle="ready to distribute"
					icon={CheckCircle}
					color="setu"
					trend={{ value: 3, direction: "up" }}
				/>
				<DashboardCard
					title="In Transit"
					value={inTransitCount}
					subtitle="on the way"
					icon={Truck}
					color="setu"
					trend={{ value: 2, direction: "up" }}
				/>
				<DashboardCard
					title="Total Quantity"
					value={totalQuantity}
					subtitle="units tracked"
					variant="green"
					icon={BarChart3}
				/>
				<DashboardCard
					title="Available"
					value={availableGoods}
					subtitle="ready to distribute"
					variant="green"
					icon={CheckCircle}
				/>
				<DashboardCard
					title="Distributed"
					value={distributedGoods}
					subtitle="sent to beneficiaries"
					variant="green"
					icon={Van}
				/>
			</div>

			{/* Filters */}
			<div className="flex gap-4 flex-wrap">
				<div className="flex-1 min-w-64">
					<input
						type="text"
						placeholder="Search goods by name or category..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
					/>
				</div>
				<div className="min-w-48">
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value as any)}
						className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu">
						<option value="all">All Status</option>
						<option value="available">Available</option>
						<option value="distributed">Distributed</option>
						<option value="damaged">Damaged</option>
					</select>
				</div>
				<div className="min-w-48">
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as any)}
						className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu">
						<option value="name">Sort by Name</option>
						<option value="quantity">Sort by Quantity</option>
						<option value="date">Sort by Date</option>
					</select>
				</div>
			</div>

			{/* Goods Table */}
			<div className="bg-white border border-setu-200 rounded-xl shadow-sm overflow-hidden card-lift">
				<table className="w-full">
					<thead className="bg-setu-50 border-b border-setu-200">
						<tr>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Name
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Category
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Quantity
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Condition
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Location
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Status
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-setu-200">
						{filteredGoods.length > 0 ? (
							filteredGoods.map((good) => (
								<tr
									key={good.id}
									className="hover:bg-setu-50 transition-colors">
									<td className="px-6 py-4">
										<div>
											<p className="font-semibold text-setu-950">{good.name}</p>
											<p className="text-sm text-setu-600">{good.donor}</p>
										</div>
									</td>
									<td className="px-6 py-4 text-setu-700 font-medium">
										{good.category}
									</td>
									<td className="px-6 py-4">
										<span className="inline-block px-3 py-1 bg-setu-100 text-setu-700 text-sm rounded-full font-medium">
											{good.quantity} {good.unit}
										</span>
									</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												good.condition === "new"
													? "success"
													: good.condition === "good"
														? "default"
														: "warning"
											}>
											{good.condition.charAt(0).toUpperCase() +
												good.condition.slice(1)}
										</Badge>
									</td>
									<td className="px-6 py-4 text-setu-600 text-sm">
										{good.location}
									</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												good.status === "available"
													? "success"
													: good.status === "distributed"
														? "default"
														: "secondary"
											}>
											{good.status.charAt(0).toUpperCase() +
												good.status.slice(1)}
										</Badge>
									</td>
									<td className="px-6 py-4 flex gap-2">
										<ActionButton
											onClick={() => handleEdit(good)}
											variant="edit"
											size="sm"
										/>
										<ActionButton
											onClick={() => handleDelete(good.id)}
											variant="delete"
											size="sm"
										/>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={7}
									className="px-6 py-8 text-center text-setu-600">
									No goods found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Edit Modal */}
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setSelectedGood(null);
				}}
				title={selectedGood ? "Edit Good" : "New Good"}>
				{selectedGood && (
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-semibold text-setu-900 mb-2">
								Name
							</label>
							<input
								type="text"
								defaultValue={selectedGood.name}
								className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
								placeholder="Item name"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-semibold text-setu-900 mb-2">
									Category
								</label>
								<input
									type="text"
									defaultValue={selectedGood.category}
									className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
									placeholder="Category"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-setu-900 mb-2">
									Quantity
								</label>
								<input
									type="number"
									defaultValue={selectedGood.quantity}
									className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
									placeholder="Quantity"
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-semibold text-setu-900 mb-2">
									Condition
								</label>
								<select className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu">
									<option>New</option>
									<option>Good</option>
									<option>Fair</option>
									<option>Poor</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-semibold text-setu-900 mb-2">
									Status
								</label>
								<select className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu">
									<option>Available</option>
									<option>Distributed</option>
									<option>Damaged</option>
								</select>
							</div>
						</div>
						<div className="flex gap-3 justify-end mt-6">
							<button
								onClick={() => setShowModal(false)}
								className="px-4 py-2 border border-setu-300 text-setu-700 rounded-lg font-semibold hover:bg-setu-50 transition-colors">
								Cancel
							</button>
							<button className="px-4 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
								Save Changes
							</button>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
