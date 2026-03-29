"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";

interface Column<T> {
	key: keyof T;
	label: string;
	sortable?: boolean;
	render?: (value: any, row: T) => React.ReactNode;
	className?: string;
}

interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	searchableFields?: (keyof T)[];
	title?: string;
	onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
	data,
	columns,
	searchableFields = [],
	title,
	onRowClick,
}: DataTableProps<T>) {
	const [search, setSearch] = useState("");
	const [sortKey, setSortKey] = useState<keyof T | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const filteredData = useMemo(() => {
		let result = [...data];

		// Apply search filter
		if (search && searchableFields.length > 0) {
			const searchLower = search.toLowerCase();
			result = result.filter((row) =>
				searchableFields.some((field) =>
					String(row[field]).toLowerCase().includes(searchLower),
				),
			);
		}

		// Apply sorting
		if (sortKey) {
			result.sort((a, b) => {
				const aVal = a[sortKey];
				const bVal = b[sortKey];

				if (typeof aVal === "string") {
					return sortDirection === "asc"
						? aVal.localeCompare(String(bVal))
						: String(bVal).localeCompare(aVal);
				}

				return sortDirection === "asc"
					? (aVal as number) - (bVal as number)
					: (bVal as number) - (aVal as number);
			});
		}

		return result;
	}, [data, search, sortKey, sortDirection, searchableFields]);

	const handleSort = (key: keyof T, sortable?: boolean) => {
		if (!sortable) return;

		if (sortKey === key) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortKey(key);
			setSortDirection("asc");
		}
	};

	return (
		<div className="bg-white rounded-lg border border-setu-100 shadow-sm overflow-hidden">
			<div className="p-6 border-b border-setu-100">
				<div className="flex items-center justify-between gap-4">
					<div>
						{title && (
							<h3 className="text-lg font-semibold text-setu-900">{title}</h3>
						)}
						<p className="text-sm text-setu-500 mt-1">
							Showing {filteredData.length} of {data.length} records
						</p>
					</div>

					{searchableFields.length > 0 && (
						<div className="relative flex-1 max-w-xs">
							<Search
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-setu-400"
							/>
							<input
								type="text"
								placeholder="Search..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500 focus:border-transparent"
							/>
						</div>
					)}
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="bg-setu-50 border-b border-setu-100">
							{columns.map((column, idx) => (
								<th
									key={`${String(column.key)}-${idx}`}
									onClick={() => handleSort(column.key, column.sortable)}
									className={`px-6 py-4 text-left text-sm font-semibold text-setu-700 ${
										column.sortable ? "cursor-pointer hover:bg-setu-100" : ""
									} ${column.className || ""}`}>
									<div className="flex items-center gap-2">
										{column.label}
										{column.sortable && sortKey === column.key && (
											<span className="text-setu-600">
												{sortDirection === "asc" ? (
													<ChevronUp size={16} />
												) : (
													<ChevronDown size={16} />
												)}
											</span>
										)}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filteredData.length > 0 ? (
							filteredData.map((row, idx) => (
								<tr
									key={idx}
									onClick={() => onRowClick?.(row)}
									className={`border-b border-setu-50 ${
										onRowClick ? "cursor-pointer hover:bg-setu-50" : ""
									} transition-colors`}>
									{columns.map((column) => (
										<td
											key={String(column.key)}
											className={`px-6 py-4 text-sm text-setu-900 ${column.className || ""}`}>
											{column.render
												? column.render(row[column.key], row)
												: String(row[column.key])}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={columns.length}
									className="px-6 py-12 text-center text-setu-500">
									<p className="text-lg font-medium mb-1">No data found</p>
									<p className="text-sm">Try adjusting your search filters</p>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default DataTable;
