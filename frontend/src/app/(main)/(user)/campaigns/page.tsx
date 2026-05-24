"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
	Search,
	MapPin,
	Users,
	ChevronRight,
	ShieldCheck,
	SlidersHorizontal,
	ArrowRight,
	TrendingUp,
	Heart,
	Loader2,
} from "lucide-react";
import {
	CampaignCard,
	type Campaign as CardCampaign,
} from "@/src/components/campaign-card";
import {
	useGetAllCampaigns,
	type Campaign as ApiCampaign,
} from "@/src/hooks/useCampaign";
import { useGetCategories } from "@/src/hooks/useCategory";
import { usePublicStats, formatNPR, formatCount } from "@/src/hooks/usePublicStats";

const SORT_MAP: Record<
	string,
	{ sortBy: string; order: "asc" | "desc"; urgent?: boolean }
> = {
	"Most Recent": { sortBy: "createdAt", order: "desc" },
	"Most Funded": { sortBy: "raisedAmount", order: "desc" },
	"Urgent First": { sortBy: "createdAt", order: "desc", urgent: true },
	"Ending Soon": { sortBy: "endDate", order: "asc" },
};

const SORT_OPTIONS = [
	"Most Recent",
	"Most Funded",
	"Urgent First",
	"Ending Soon",
];

const CAT_CLASS: Record<string, string> = {
	"Emergency Relief": "emergency",
	Medical: "medical",
	Education: "education",
	Charity: "charity",
	Animals: "animals",
	Environment: "emergency",
};

const LIMIT = 6;

const heroPct = (raised: number, goal: number) =>
  Math.min(Math.round((raised / goal) * 100), 100);

const heroFmt = (n: number) =>
  n >= 100000 ? `NPR ${(n / 100000).toFixed(1)}L` : `NPR ${n.toLocaleString()}`;

const transformCampaign = (c: ApiCampaign): CardCampaign => {
	const endDate = c.endDate ? new Date(c.endDate) : null;
	const daysLeft = endDate
		? Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / 86_400_000))
		: undefined;

	return {
		id: c._id,
		title: c.title,
		desc: c.description,
		img: c.images?.url ?? "",
		raised: c.raisedAmount,
		goal: c.goalAmount,
		donors: c.donorsCount,
		cat: c.category?.name ?? "",
		catClass: CAT_CLASS[c.category?.name ?? ""] ?? "charity",
		urgent: c.urgent,
		location: c.location?.name ?? "",
		daysLeft,
	};
};

export default function CampaignsPage() {
	const [activeCategoryId, setActiveCategoryId] = useState("");
	const [activeCategoryName, setActiveCategoryName] = useState("All");
	const [activeSort, setActiveSort] = useState("Most Recent");
	const [searchInput, setSearchInput] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [page, setPage] = useState(1);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			setDebouncedSearch(searchInput);
			setPage(1);
		}, 400);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [searchInput]);

	useEffect(() => {
		setPage(1);
	}, [activeCategoryId, activeSort]);

	const { sortBy, order, urgent } = SORT_MAP[activeSort];
	const queryParams = {
		page,
		limit: LIMIT,
		status: "active",
		sortBy,
		order,
		...(activeCategoryId ? { category: activeCategoryId } : {}),
		...(debouncedSearch ? { search: debouncedSearch } : {}),
		...(urgent ? { urgent: true } : {}),
	};

	const { data, isLoading, isFetching } = useGetAllCampaigns(queryParams);
	const { data: categoriesData } = useGetCategories();
	const { data: statsData } = usePublicStats();
	const { data: heroData } = useGetAllCampaigns({ page: 1, limit: 3, status: "active", sortBy: "raisedAmount", order: "desc" });
	const ps = statsData?.data;

	const totalPages = data?.pagination?.totalPages ?? 1;
	const totalCount = data?.pagination?.total ?? 0;

	const handleCategorySelect = useCallback((id: string, name: string) => {
		setActiveCategoryId(id);
		setActiveCategoryName(name);
	}, []);

	const displayCampaigns = (data?.campaigns ?? []).map(transformCampaign);
	const heroCampaigns = (heroData?.campaigns ?? []).map(transformCampaign);
	const isFirstLoad = isLoading && page === 1;

	// Pagination helpers
	const getPageNumbers = () => {
		if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
		if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
		if (page >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
		return [1, "...", page - 1, page, page + 1, "...", totalPages];
	};

	return (
		<div
			className="bg-cream min-h-screen"
			style={{ fontFamily: "var(--font-body)" }}>
			<section className="bg-white border-b border-setu-100 py-14 overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
								<div className="w-6 h-[2px] bg-setu-500 rounded" />
								Browse All Causes
							</div>
							<h1
								className="text-[clamp(34px,4vw,54px)] font-bold text-setu-950 leading-tight tracking-[-1px] mb-4"
								style={{ fontFamily: "var(--font-display)" }}>
								Find a Campaign
								<br />
								<em className="italic text-setu-600">Worth Fighting For</em>
							</h1>
							<p className="text-[16px] text-setu-800/55 leading-[1.75] mb-8 max-w-lg">
								From disaster relief to education, browse verified campaigns
								making a real difference across Nepal.
							</p>

							<div className="relative max-w-xl mb-6">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-setu-400" />
								<input
									type="text"
									placeholder="Search campaigns, locations..."
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									className="w-full pl-12 pr-4 py-3.5 bg-setu-50 border border-setu-200 rounded-full text-[14px] text-setu-900 placeholder:text-setu-400 focus:outline-none focus:border-setu-500 focus:ring-2 focus:ring-setu-500/20 transition-all"
								/>
							</div>

							<div className="flex items-center gap-3 flex-wrap">
								<Link
									href="/campaigns/create"
									className="inline-flex items-center gap-2 px-7 py-3.5 bg-setu-700 hover:bg-setu-600 text-white text-[14px] font-bold rounded-full no-underline shadow-[0_4px_14px_rgba(21,104,57,0.35)] hover:shadow-[0_6px_22px_rgba(21,104,57,0.4)] hover:-translate-y-px transition-all duration-200">
									Start a Campaign <ArrowRight className="w-4 h-4" />
								</Link>
								<Link
									href="/how-it-works"
									className="inline-flex items-center gap-2 px-7 py-3.5 border border-setu-200 text-setu-700 text-[14px] font-semibold rounded-full no-underline hover:bg-setu-50 hover:border-setu-400 transition-all duration-200">
									How It Works
								</Link>
							</div>
						</div>

						<div className="hidden lg:block flex-shrink-0 w-[440px]">
							<div className="relative h-[320px]">

								{/* ── Large card (campaign 1) ── */}
								{heroCampaigns[0] ? (
									<Link
										href={`/campaigns/${heroCampaigns[0].id}`}
										className="absolute left-0 top-0 w-[260px] h-[280px] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(21,104,57,0.18)] border-4 border-white block no-underline"
									>
										{heroCampaigns[0].img ? (
											<img src={heroCampaigns[0].img} alt={heroCampaigns[0].title} className="w-full h-full object-cover" />
										) : (
											<div className="w-full h-full bg-gradient-to-br from-setu-800 to-setu-950" />
										)}
										{heroCampaigns[0].urgent && (
											<div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">
												<span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
												Urgent
											</div>
										)}
										<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3">
											<p className="text-white text-[11px] font-bold truncate mb-1.5">
												{heroCampaigns[0].title}
											</p>
											<div className="h-1 bg-white/30 rounded-full overflow-hidden">
												<div className="h-full bg-setu-400 rounded-full" style={{ width: `${heroPct(heroCampaigns[0].raised, heroCampaigns[0].goal)}%` }} />
											</div>
											<div className="flex justify-between mt-1">
												<span className="text-white/80 text-[10px]">{heroFmt(heroCampaigns[0].raised)} raised</span>
												<span className="text-setu-300 text-[10px] font-bold">{heroPct(heroCampaigns[0].raised, heroCampaigns[0].goal)}%</span>
											</div>
										</div>
									</Link>
								) : (
									<div className="absolute left-0 top-0 w-[260px] h-[280px] rounded-2xl bg-setu-100 border-4 border-white animate-pulse" />
								)}

								{/* ── Top-right small card (campaign 2) ── */}
								{heroCampaigns[1] ? (
									<Link
										href={`/campaigns/${heroCampaigns[1].id}`}
										className="absolute right-0 top-0 w-[165px] h-[150px] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(21,104,57,0.15)] border-4 border-white block no-underline"
									>
										{heroCampaigns[1].img ? (
											<img src={heroCampaigns[1].img} alt={heroCampaigns[1].title} className="w-full h-full object-cover" />
										) : (
											<div className="w-full h-full bg-gradient-to-br from-setu-700 to-setu-900" />
										)}
										<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2.5 py-2">
											<p className="text-white text-[10px] font-bold truncate">
												{heroCampaigns[1].title}
											</p>
										</div>
									</Link>
								) : (
									<div className="absolute right-0 top-0 w-[165px] h-[150px] rounded-2xl bg-setu-100 border-4 border-white animate-pulse" />
								)}

								{/* ── Bottom-right small card (campaign 3) ── */}
								{heroCampaigns[2] ? (
									<Link
										href={`/campaigns/${heroCampaigns[2].id}`}
										className="absolute right-0 bottom-0 w-[165px] h-[150px] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(21,104,57,0.15)] border-4 border-white block no-underline"
									>
										{heroCampaigns[2].img ? (
											<img src={heroCampaigns[2].img} alt={heroCampaigns[2].title} className="w-full h-full object-cover" />
										) : (
											<div className="w-full h-full bg-gradient-to-br from-setu-700 to-setu-900" />
										)}
										<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2.5 py-2">
											<p className="text-white text-[10px] font-bold truncate">
												{heroCampaigns[2].title}
											</p>
										</div>
									</Link>
								) : (
									<div className="absolute right-0 bottom-0 w-[165px] h-[150px] rounded-2xl bg-setu-100 border-4 border-white animate-pulse" />
								)}

								{/* ── Donor count badge ── */}
								<div className="absolute bottom-[148px] right-[148px] translate-x-1/2 translate-y-1/2 z-10 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-setu-100 px-3 py-2 flex items-center gap-2">
									<div className="flex -space-x-1.5">
										{[11, 12, 13].map((i) => (
											<img key={i} src={`https://i.pravatar.cc/24?img=${i}`} className="w-6 h-6 rounded-full border-2 border-white object-cover" alt="" />
										))}
									</div>
									<div>
										<p className="text-[11px] font-bold text-setu-950 leading-none">
											{heroCampaigns.length > 0
												? `${heroCampaigns.reduce((s, c) => s + c.donors, 0).toLocaleString()}+`
												: "…"}
										</p>
										<p className="text-[9px] text-gray-400 leading-none mt-0.5">donors</p>
									</div>
								</div>

								{/* ── Verified badge ── */}
								<div className="absolute top-[72px] left-[248px] z-10 bg-setu-700 text-white rounded-xl shadow-[0_4px_16px_rgba(21,104,57,0.3)] px-3 py-2 flex items-center gap-1.5">
									<ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
									<p className="text-[11px] font-bold leading-none">Verified</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-setu-100">
						{[
							{ icon: TrendingUp, n: ps ? formatCount(ps.activeCampaigns) : "...", l: "Active Campaigns" },
							{ icon: Users, n: ps ? formatCount(ps.totalDonors) : "...", l: "Total Donors" },
							{ icon: Heart, n: ps ? formatNPR(ps.totalRaised) : "...", l: "Total Raised" },
							{ icon: MapPin, n: "77 Districts", l: "Across Nepal" },
						].map(({ icon: Icon, n, l }) => (
							<div
								key={l}
								className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-xl bg-setu-50 border border-setu-100 flex items-center justify-center flex-shrink-0">
									<Icon className="w-4 h-4 text-setu-600" />
								</div>
								<div>
									<p
										className="text-[16px] font-bold text-setu-900 leading-none"
										style={{ fontFamily: "var(--font-display)" }}>
										{n}
									</p>
									<p className="text-[11px] text-setu-600/60 font-medium mt-0.5">
										{l}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
						<div className="flex flex-wrap gap-2">
							<button
								onClick={() => handleCategorySelect("", "All")}
								className={[
									"px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150",
									activeCategoryName === "All"
										? "bg-setu-700 text-white border-setu-700 shadow-[0_2px_8px_rgba(21,104,57,0.25)]"
										: "bg-white text-setu-700 border-setu-200 hover:border-setu-400 hover:bg-setu-50",
								].join(" ")}>
								All
							</button>

							{(categoriesData?.data ?? []).map((cat) => (
								<button
									key={cat._id}
									onClick={() => handleCategorySelect(cat._id, cat.name)}
									className={[
										"px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150",
										activeCategoryId === cat._id
											? "bg-setu-700 text-white border-setu-700 shadow-[0_2px_8px_rgba(21,104,57,0.25)]"
											: "bg-white text-setu-700 border-setu-200 hover:border-setu-400 hover:bg-setu-50",
									].join(" ")}>
									{cat.name}
								</button>
							))}
						</div>

						<div className="flex items-center gap-2">
							<SlidersHorizontal className="w-4 h-4 text-setu-500 flex-shrink-0" />
							<select
								value={activeSort}
								onChange={(e) => setActiveSort(e.target.value)}
								className="text-[13px] font-semibold text-setu-700 bg-white border border-setu-200 rounded-full px-4 py-2 focus:outline-none focus:border-setu-500 cursor-pointer">
								{SORT_OPTIONS.map((opt) => (
									<option key={opt}>{opt}</option>
								))}
							</select>
						</div>
					</div>

					<p className="text-[13px] text-setu-600/60 font-medium mb-6">
						{isFirstLoad ? (
							"Loading campaigns…"
						) : (
							<>
								Showing{" "}
								<strong className="text-setu-800">
									{displayCampaigns.length}
								</strong>
								{data?.pagination?.total ? (
									<>
										{" "}
										of{" "}
										<strong className="text-setu-800">
											{data.pagination.total}
										</strong>
									</>
								) : null}{" "}
								campaigns
								{activeCategoryName !== "All" && (
									<>
										{" "}
										in{" "}
										<span className="text-setu-700">{activeCategoryName}</span>
									</>
								)}
								{debouncedSearch && (
									<>
										{" "}
										matching{" "}
										<span className="text-setu-700">"{debouncedSearch}"</span>
									</>
								)}
							</>
						)}
					</p>

					{isFirstLoad ? (
						<div className="flex flex-col items-center justify-center py-24 gap-4">
							<Loader2 className="w-8 h-8 animate-spin text-setu-500" />
							<p className="text-[14px] text-setu-600/60 font-medium">
								Loading campaigns…
							</p>
						</div>
					) : displayCampaigns.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-24 gap-4">
							<div className="w-16 h-16 bg-setu-50 border border-setu-100 rounded-full flex items-center justify-center">
								<Search className="w-7 h-7 text-setu-300" />
							</div>
							<div className="text-center">
								<p className="text-[16px] font-bold text-setu-900 mb-1">
									No campaigns found
								</p>
								<p className="text-[14px] text-setu-600/60">
									{debouncedSearch
										? `No results for "${debouncedSearch}". Try a different keyword.`
										: "No active campaigns in this category yet."}
								</p>
							</div>
							{(debouncedSearch || activeCategoryId) && (
								<button
									onClick={() => {
										setSearchInput("");
										setDebouncedSearch("");
										handleCategorySelect("", "All");
									}}
									className="px-5 py-2.5 bg-setu-700 text-white text-[13px] font-semibold rounded-full hover:bg-setu-600 transition-colors">
									Clear filters
								</button>
							)}
						</div>
					) : (
						<>
							<div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isFetching ? "opacity-60" : "opacity-100"}`}>
								{displayCampaigns.map((c) => (
									<CampaignCard key={c.id} c={c} />
								))}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
									{/* Prev */}
									<button
										onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
										disabled={page === 1 || isFetching}
										className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-setu-200 text-setu-700 text-[13px] font-semibold rounded-full hover:bg-setu-50 hover:border-setu-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
									>
										← Prev
									</button>

									{/* Page numbers */}
									{getPageNumbers().map((p, i) =>
										p === "..." ? (
											<span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-[13px] select-none">…</span>
										) : (
											<button
												key={p}
												onClick={() => { setPage(p as number); window.scrollTo({ top: 0, behavior: "smooth" }); }}
												disabled={isFetching}
												className={`w-10 h-10 rounded-full text-[13px] font-bold transition-all cursor-pointer border ${
													page === p
														? "bg-setu-700 text-white border-setu-700 shadow-[0_2px_10px_rgba(21,104,57,0.3)]"
														: "bg-white text-setu-700 border-setu-200 hover:border-setu-400 hover:bg-setu-50"
												}`}
											>
												{p}
											</button>
										)
									)}

									{/* Next */}
									<button
										onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
										disabled={page === totalPages || isFetching}
										className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-setu-200 text-setu-700 text-[13px] font-semibold rounded-full hover:bg-setu-50 hover:border-setu-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
									>
										Next →
									</button>
								</div>
							)}

							{/* Page info */}
							{totalCount > 0 && (
								<p className="text-center text-[12px] text-setu-600/50 mt-3">
									Page {page} of {totalPages} · {totalCount} campaigns total
								</p>
							)}
						</>
					)}
				</div>
			</section>

			<section className="py-16 bg-setu-900 mx-4 sm:mx-6 lg:mx-8 rounded-[28px] mb-16 overflow-hidden relative">
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						background:
							"radial-gradient(ellipse 60% 80% at 80% 50%, rgba(34,160,91,0.15) 0%, transparent 70%)",
					}}
				/>
				<div className="max-w-7xl mx-auto px-8 sm:px-14 relative flex flex-col md:flex-row items-center justify-between gap-8">
					<div>
						<p className="text-[11px] font-bold uppercase tracking-[0.15em] text-setu-400 mb-3">
							Have a cause?
						</p>
						<h2
							className="text-[clamp(26px,3vw,40px)] font-bold text-white leading-tight tracking-[-0.5px]"
							style={{ fontFamily: "var(--font-display)" }}>
							Start your own
							<br />
							<em className="italic text-setu-300">fundraiser today</em>
						</h2>
					</div>
					<div className="flex gap-3 flex-wrap">
						<Link
							href="/campaigns/create"
							className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-setu-800 text-[14px] font-bold rounded-full no-underline hover:bg-setu-50 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
							Start a Campaign <ArrowRight className="w-4 h-4" />
						</Link>
						<Link
							href="/how-it-works"
							className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white text-[14px] font-semibold rounded-full no-underline hover:bg-white/10 transition-colors">
							How It Works
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
