"use client";

import { useMemo, useState } from "react";
import { Folder, CheckCircle, XCircle } from "lucide-react";
import { DashboardCard } from "@/src/components/dashboard/DashboardCard";
import { Badge } from "@/src/components/dashboard/Badge";
import { ActionButton } from "@/src/components/dashboard/ActionButton";
import { Modal } from "@/src/components/dashboard/Modal";
import {
	type Category,
	type CategoryStatus,
	useCreateCategory,
	useDeleteCategory,
	useGetCategories,
	useUpdateCategory,
} from "@/src/hooks/useCategory";

export default function CategoriesPage() {
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<"name" | "status" | "createdAt">("name");

	const [form, setForm] = useState<{
		name: string;
		description: string;
		status: CategoryStatus;
	}>({
		name: "",
		description: "",
		status: "active",
	});

	const { data, isLoading, isError, error } = useGetCategories({
		page: 1,
		limit: 100,
	});

	const categories = data?.data ?? [];

	const filteredCategories = useMemo(() => {
		const term = searchTerm.toLowerCase();
		const arr = categories.filter((c) => c.name.toLowerCase().includes(term));

		return arr.sort((a, b) => {
			if (sortBy === "name") return a.name.localeCompare(b.name);
			if (sortBy === "status") {
				if (a.status === b.status) return 0;
				return a.status === "active" ? -1 : 1;
			}
			if (sortBy === "createdAt") {
				const aT = a.createdAt ? new Date(a.createdAt).getTime() : 0;
				const bT = b.createdAt ? new Date(b.createdAt).getTime() : 0;
				return bT - aT;
			}
			return 0;
		});
	}, [categories, searchTerm, sortBy]);

	const activeCount = categories.filter((c) => c.status === "active").length;
	const inactiveCount = categories.filter((c) => c.status === "inactive").length;

	const { mutate: createCategory, isPending: creating } = useCreateCategory();
	const { mutate: updateCategory, isPending: updating } = useUpdateCategory();
	const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory();

	const openCreateModal = () => {
		setSelectedCategory(null);
		setForm({ name: "", description: "", status: "active" });
		setShowModal(true);
	};

	const handleEdit = (category: Category) => {
		setSelectedCategory(category);
		setForm({
			name: category.name,
			description: category.description ?? "",
			status: category.status,
		});
		setShowModal(true);
	};

	const handleDelete = (id: string) => {
		if (!confirm("Are you sure you want to delete this category?")) return;
		deleteCategory(id);
	};

	const handleSave = () => {
		const name = form.name.trim();
		const description = form.description.trim();

		if (!name) {
			alert("Category name is required.");
			return;
		}

		if (selectedCategory) {
			updateCategory(
				{
					id: selectedCategory._id,
					name,
					description,
					status: form.status,
				},
				{
					onSuccess: () => {
						setShowModal(false);
						setSelectedCategory(null);
					},
				},
			);
		} else {
			createCategory(
				{ name, description },
				{
					onSuccess: () => {
						setShowModal(false);
					},
				},
			);
		}
	};

	return (
		<div className="space-y-8 pb-8">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold font-display text-setu-950 mb-2">
						Categories
					</h1>
					<p className="text-setu-600">
						Manage relief categories and disaster types
					</p>
				</div>
				<button
					onClick={openCreateModal}
					className="px-6 py-3 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors">
					+ New Category
				</button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<DashboardCard
					title="Total Categories"
					value={categories.length}
					subtitle="relief types"
					color="green"
					icon={Folder}
					trend={{ value: 5, direction: "up" }}
				/>
				<DashboardCard
					title="Active Categories"
					value={activeCount}
					subtitle="currently in use"
					color="green"
					icon={CheckCircle}
					trend={{ value: 2, direction: "up" }}
				/>
				<DashboardCard
					title="Inactive Categories"
					value={inactiveCount}
					subtitle="disabled categories"
					color="green"
					icon={XCircle}
					trend={{ value: 1, direction: "up" }}
				/>
			</div>

			{/* Categories Table */}
			<div className="bg-white border border-setu-200 rounded-xl shadow-sm overflow-hidden card-lift">
				<div className="p-6 border-b border-setu-200">
					<div className="flex items-center justify-between gap-4">
						<div className="flex-1">
							<input
								type="text"
								placeholder="Search categories..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu focus:ring-2 focus:ring-setu-400 focus:ring-offset-0"
							/>
						</div>
						<select
							value={sortBy}
							onChange={(e) =>
								setSortBy(e.target.value as "name" | "status" | "createdAt")
							}
							className="px-4 py-2 border border-setu-200 rounded-lg input-setu">
							<option value="name">Sort by Name</option>
							<option value="status">Sort by Status</option>
							<option value="createdAt">Sort by Date</option>
						</select>
					</div>
				</div>

				<table className="w-full">
					<thead className="bg-setu-50 border-b border-setu-200">
						<tr>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Name
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Description
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Status
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Created
							</th>
							<th className="px-6 py-4 text-left text-sm font-semibold text-setu-900">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-setu-200">
						{isLoading ? (
							<tr>
								<td colSpan={5} className="px-6 py-10 text-center text-setu-600">
									Loading categories...
								</td>
							</tr>
						) : isError ? (
							<tr>
								<td colSpan={5} className="px-6 py-10 text-center text-red-600">
									Failed to load categories.
									{error?.message ? ` ${error.message}` : ""}
								</td>
							</tr>
						) : filteredCategories.length > 0 ? (
							filteredCategories.map((category) => (
								<tr
									key={category._id}
									className="hover:bg-setu-50 transition-colors">
									<td className="px-6 py-4 font-semibold text-setu-950">
										{category.name}
									</td>
									<td className="px-6 py-4 text-setu-600 text-sm">
										{category.description || "—"}
									</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												category.status === "active" ? "success" : "warning"
											}>
											{category.status === "active" ? "Active" : "Inactive"}
										</Badge>
									</td>
									<td className="px-6 py-4 text-setu-600 text-sm">
										{category.createdAt
											? new Date(category.createdAt).toLocaleDateString()
											: "—"}
									</td>
									<td className="px-6 py-4 flex gap-2">
										<ActionButton
											onClick={() => handleEdit(category)}
											variant="edit"
											size="sm"
										/>
										<ActionButton
											onClick={() => handleDelete(category._id)}
											variant="delete"
											size="sm"
											disabled={deleting}
										/>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={5}
									className="px-6 py-8 text-center text-setu-600">
									No categories found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Create/Edit Modal */}
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setSelectedCategory(null);
					setForm({ name: "", description: "", status: "active" });
				}}
				title={selectedCategory ? "Edit Category" : "New Category"}
				footer={
					<div className="flex gap-3 justify-end">
						<button
							onClick={() => {
								setShowModal(false);
								setSelectedCategory(null);
							}}
							className="px-4 py-2 border border-setu-300 text-setu-700 rounded-lg font-semibold hover:bg-setu-50 transition-colors">
							Cancel
						</button>
						<button
							onClick={handleSave}
							disabled={creating || updating}
							className="px-4 py-2 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
							{selectedCategory
								? updating
									? "Saving..."
									: "Save Changes"
								: creating
									? "Creating..."
									: "Create Category"}
						</button>
					</div>
				}>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-semibold text-setu-900 mb-2">
							Name
						</label>
						<input
							type="text"
							value={form.name}
							onChange={(e) =>
								setForm((f) => ({ ...f, name: e.target.value }))
							}
							className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
							placeholder="Category name"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-setu-900 mb-2">
							Description
						</label>
						<textarea
							value={form.description}
							onChange={(e) =>
								setForm((f) => ({ ...f, description: e.target.value }))
							}
							className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu"
							placeholder="Category description"
							rows={3}
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-setu-900 mb-2">
							Status
						</label>
						<select
							value={form.status}
							onChange={(e) =>
								setForm((f) => ({
									...f,
									status: e.target.value as CategoryStatus,
								}))
							}
							className="w-full px-4 py-2 border border-setu-200 rounded-lg input-setu">
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
						</select>
					</div>
				</div>
			</Modal>
		</div>
	);
}
