"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Loader2,
	MapPin,
	Target,
	Heart,
	Zap,
	Eye,
	Users,
	ShieldCheck,
	Globe,
	Upload,
	X,
	Image,
	FileText,
	Clock,
	AlignLeft,
	Tag,
	CheckCircle2,
	XCircle,
} from "lucide-react";
import { Toaster, toast } from "sonner"; // ← FIX 1: added toast
import { useCreateCampaign } from "@/src/hooks/useCampaign";
import { useGetCategories } from "@/src/hooks/useCategory";
import { useRouter } from "next/navigation";
import { MapPicker } from "@/src/components/mapPicker";

// ── Steps ─────────────────────────────────────────────────────
const STEPS = [
	{ n: 1, label: "Basic Info" },
	{ n: 2, label: "Story & Media" },
	{ n: 3, label: "Goal & Timeline" },
	{ n: 4, label: "Review" },
];

// ── Category icon/color metadata keyed by backend name ────────
const CATEGORY_META: Record<
	string,
	{ icon: React.ElementType; color: string; bg: string; border: string }
> = {
	"Emergency Relief": {
		icon: Zap,
		color: "text-orange-600",
		bg: "bg-orange-50",
		border: "border-orange-200",
	},
	Medical: {
		icon: Heart,
		color: "text-red-600",
		bg: "bg-red-50",
		border: "border-red-200",
	},
	Education: {
		icon: Eye,
		color: "text-blue-600",
		bg: "bg-blue-50",
		border: "border-blue-200",
	},
	Charity: {
		icon: Users,
		color: "text-setu-600",
		bg: "bg-setu-50",
		border: "border-setu-200",
	},
	Animals: {
		icon: ShieldCheck,
		color: "text-purple-600",
		bg: "bg-purple-50",
		border: "border-purple-200",
	},
	Environment: {
		icon: Globe,
		color: "text-emerald-600",
		bg: "bg-emerald-50",
		border: "border-emerald-200",
	},
};

const durations = [
	{ key: "15", label: "15 days" },
	{ key: "30", label: "30 days" },
	{ key: "45", label: "45 days" },
	{ key: "60", label: "60 days" },
	{ key: "90", label: "90 days" },
];

const tips = [
	{
		heading: "A strong title matters",
		body: "Campaigns with specific, personal titles raise 3x more than generic ones. Mention who you're helping and where.",
	},
	{
		heading: "Show, don't just tell",
		body: "Campaigns with photos raise 2x more. Use a real image of the situation — authentic photos build trust instantly.",
	},
	{
		heading: "Set a realistic goal",
		body: "Break your goal into milestones. Campaigns that reach 30% of their goal in the first week are 5x more likely to succeed.",
	},
	{
		heading: "Review carefully",
		body: "Donors read every word. Make sure your story is compelling, your goal is clear, and your contact details are correct.",
	},
];

const computeEndDate = (days: string): string => {
	const d = new Date();
	d.setDate(d.getDate() + Number(days));
	return d.toISOString();
};

// ── Main Page ──────────────────────────────────────────────────
export default function CreateCampaignPage() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [focused, setFocused] = useState<string | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);
	const [coverPreview, setCoverPreview] = useState<string | null>(null);
	const [coverFile, setCoverFile] = useState<File | null>(null);

	const { mutate: createCampaign, isPending: submitting } = useCreateCampaign();
	const { data: categoriesData, isLoading: categoriesLoading } =
		useGetCategories();

	const [form, setForm] = useState({
		title: "",
		categoryId: "",
		categoryName: "",
		locationName: "",
		longitude: 0,
		latitude: 0,
		beneficiary: "",
		story: "",
		goal: "",
		duration: "30",
		website: "",
		tags: "",
		agreeTerms: false,
	});

	const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
		setForm((f) => ({ ...f, [k]: v }));

	const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setCoverFile(file);
		setCoverPreview(URL.createObjectURL(file));
	};

	const handleMapSelect = useCallback(
		({ lat, lng, name }: { lat: number; lng: number; name: string }) => {
			setForm((f) => ({
				...f,
				latitude: lat,
				longitude: lng,
				locationName: name,
			}));
		},
		[],
	);

	// ── FIX 3: image required in step 2 validation ──────────────
	const canNext: Record<number, boolean> = {
		1: form.title.trim().length >= 10 && !!form.categoryId && !!form.longitude,
		2: form.story.trim().length >= 80 && !!coverFile,
		3: !!form.goal && Number(form.goal) >= 10000 && !!form.duration,
		4: form.agreeTerms,
	};

	// ── FIX 2: guard before calling createCampaign ──────────────
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!coverFile) {
			toast.error(
				"Cover image is required. Please upload a photo for your campaign.",
			);
			setStep(2);
			return;
		}

		if (!form.longitude || !form.latitude) {
			toast.error("Please pin a location on the map before submitting.");
			setStep(1);
			return;
		}

		if (!form.categoryId) {
			toast.error("Please select a category.");
			setStep(1);
			return;
		}

		createCampaign(
			{
				title: form.title,
				description: form.story,
				category: form.categoryId,
				goalAmount: Number(form.goal),
				urgent: false,
				endDate: computeEndDate(form.duration),
				locationName: form.locationName,
				longitude: form.longitude,
				latitude: form.latitude,
				country: "Nepal",
				image: coverFile,
			},
			{ onSuccess: () => router.push("/admin/campaigns") },
		);
	};

	const tip = tips[step - 1];

	return (
		<>
			<Toaster
				position="top-right"
				expand={false}
				richColors={false}
				duration={4000}
				toastOptions={{
					unstyled: true,
					classNames: {
						toast: [
							"flex items-start gap-3 w-[340px] px-4 py-3.5",
							"bg-white border border-setu-100 rounded-2xl font-sans",
							"shadow-[0_8px_32px_rgba(21,104,57,0.12),0_2px_8px_rgba(0,0,0,0.06)]",
							"data-[type=success]:border-l-4 data-[type=success]:border-l-setu-500",
							"data-[type=error]:border-l-4 data-[type=error]:border-l-red-400",
						].join(" "),
						title: "text-[14px] font-semibold text-setu-950 leading-snug",
						description: "text-[12px] text-gray-500 mt-0.5 leading-relaxed",
						icon: "flex-shrink-0 mt-0.5",
					},
				}}
				icons={{
					success: (
						<div className="w-7 h-7 rounded-full bg-setu-50 border border-setu-200 flex items-center justify-center flex-shrink-0">
							<CheckCircle2 className="w-4 h-4 text-setu-600" />
						</div>
					),
					error: (
						<div className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
							<XCircle className="w-4 h-4 text-red-500" />
						</div>
					),
				}}
			/>

			{/* <div
				className="min-h-screen bg-cream"
				style={{ fontFamily: "var(--font-body)" }}> */}
			<div className="space-y-6 animate-fade-in-up">
				{/* Back */}
				<div className="mb-8">
					<Link
						href="/admin/campaigns"
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-setu-600 hover:text-setu-500 no-underline transition-colors group">
						<ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
						Back to Campaigns
					</Link>
				</div>

				<div className="flex flex-col lg:flex-row gap-10">
					{/* ── LEFT sidebar ── */}
					<div className="lg:w-72 flex-shrink-0">
						<div className="mb-8">
							<div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-2">
								<div className="w-5 h-[2px] bg-setu-500 rounded" />
								New Campaign
							</div>
							<h1
								className="text-[28px] font-bold text-setu-950 leading-tight tracking-[-0.5px]"
								style={{ fontFamily: "var(--font-display)" }}>
								Start a<br />
								<em className="italic text-setu-700">Campaign</em>
							</h1>
						</div>

						{/* Step nav */}
						<div className="bg-white rounded-2xl border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] p-4 mb-6">
							{STEPS.map(({ n, label }) => {
								const isDone = step > n;
								const isActive = step === n;
								return (
									<div
										key={n}
										className={[
											"flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
											isActive ? "bg-setu-50" : "",
										].join(" ")}>
										<div
											className={[
												"w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold transition-all",
												isDone
													? "bg-setu-600 text-white"
													: isActive
														? "bg-setu-700 text-white shadow-[0_2px_8px_rgba(21,104,57,0.3)]"
														: "bg-gray-100 text-gray-400",
											].join(" ")}>
											{isDone ? <Check className="w-3.5 h-3.5" /> : n}
										</div>
										<span
											className={`text-[13px] font-semibold transition-colors flex-1 ${isActive ? "text-setu-800" : isDone ? "text-setu-600" : "text-gray-400"}`}>
											{label}
										</span>
										{isDone && <Check className="w-3.5 h-3.5 text-setu-500" />}
									</div>
								);
							})}
						</div>

						{/* Tip */}
						<div className="bg-setu-900 rounded-2xl p-5">
							<div className="w-8 h-8 bg-setu-700/50 rounded-lg flex items-center justify-center mb-4">
								<FileText className="w-4 h-4 text-setu-300" />
							</div>
							<p
								className="text-white text-[13px] font-bold mb-1.5"
								style={{ fontFamily: "var(--font-display)" }}>
								{tip.heading}
							</p>
							<p className="text-white/50 text-[12px] leading-relaxed">
								{tip.body}
							</p>
						</div>
					</div>

					{/* ── RIGHT form ── */}
					<div className="flex-1">
						<form onSubmit={handleSubmit}>
							<div className="bg-white rounded-3xl border border-setu-100 shadow-[0_2px_16px_rgba(21,104,57,0.07)] overflow-hidden">
								{/* Step header */}
								<div className="px-8 py-6 border-b border-setu-50 bg-setu-50/50">
									<p className="text-[11px] font-bold uppercase tracking-[0.15em] text-setu-500 mb-1">
										Step {step} of 4
									</p>
									<h2
										className="text-[20px] font-bold text-setu-950"
										style={{ fontFamily: "var(--font-display)" }}>
										{step === 1 && "Basic campaign information"}
										{step === 2 && "Tell your story & add media"}
										{step === 3 && "Set your goal & timeline"}
										{step === 4 && "Review & submit"}
									</h2>
								</div>

								<div className="p-8 space-y-7">
									{/* ════ STEP 1: Basic Info ════ */}
									{step === 1 && (
										<>
											{/* Campaign title */}
											<div>
												<label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
													Campaign Title <span className="text-red-400">*</span>
												</label>
												<div
													className={`relative rounded-xl transition-all duration-200 ${focused === "title" ? "ring-2 ring-setu-500/30" : ""}`}>
													<AlignLeft
														className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === "title" ? "text-setu-600" : "text-gray-400"}`}
													/>
													<input
														type="text"
														required
														value={form.title}
														onChange={(e) => set("title", e.target.value)}
														onFocus={() => setFocused("title")}
														onBlur={() => setFocused(null)}
														placeholder="e.g. Help Rebuild Homes in Jajarkot After the Earthquake"
														maxLength={100}
														className="w-full pl-11 pr-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
													/>
												</div>
												<div className="flex justify-between mt-1.5">
													<p
														className={`text-[11px] ${form.title.length > 0 && form.title.length < 10 ? "text-red-400" : "text-gray-400"}`}>
														{form.title.length < 10 && form.title.length > 0
															? `${10 - form.title.length} more characters needed`
															: "Be specific — who, what, where"}
													</p>
													<p className="text-[11px] text-gray-400">
														{form.title.length}/100
													</p>
												</div>
											</div>

											{/* Category — from API */}
											<div>
												<label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-3">
													Category <span className="text-red-400">*</span>
												</label>
												{categoriesLoading ? (
													<div className="flex items-center gap-2 text-[13px] text-gray-400 py-2">
														<Loader2 className="w-4 h-4 animate-spin" /> Loading
														categories…
													</div>
												) : !categoriesData?.data?.length ? (
													<div className="flex items-center gap-2.5 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl">
														<p className="text-[12px] text-amber-700 font-medium">
															No categories found. Please create categories from
															the admin panel first.
														</p>
													</div>
												) : (
													<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
														{categoriesData.data.map((cat) => {
															const meta = CATEGORY_META[cat.name] ?? {
																icon: Globe,
																color: "text-setu-600",
																bg: "bg-setu-50",
																border: "border-setu-200",
															};
															const Icon = meta.icon;
															const isSelected = form.categoryId === cat._id;
															return (
																<button
																	key={cat._id}
																	type="button"
																	onClick={() => {
																		set("categoryId", cat._id);
																		set("categoryName", cat.name);
																	}}
																	className={[
																		"flex items-center gap-2.5 p-3.5 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer",
																		isSelected
																			? `${meta.bg} ${meta.border}`
																			: "bg-white border-setu-100 hover:border-setu-200",
																	].join(" ")}>
																	<div
																		className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
																		<Icon className={`w-4 h-4 ${meta.color}`} />
																	</div>
																	<span
																		className={`text-[13px] font-semibold ${isSelected ? meta.color : "text-setu-800"}`}>
																		{cat.name}
																	</span>
																	{isSelected && (
																		<Check
																			className={`w-3.5 h-3.5 ml-auto flex-shrink-0 ${meta.color}`}
																		/>
																	)}
																</button>
															);
														})}
													</div>
												)}
											</div>

											{/* ── Location — Leaflet Map ─────────────────────────── */}
											<div>
												<label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
													Campaign Location{" "}
													<span className="text-red-400">*</span>
												</label>

												<MapPicker
													onSelect={handleMapSelect}
													selectedLat={form.latitude || undefined}
													selectedLng={form.longitude || undefined}
												/>

												{/* Selected location display */}
												{form.locationName ? (
													<div className="mt-2.5 flex items-center gap-2.5 px-4 py-3 bg-setu-50 border border-setu-200 rounded-xl">
														<div className="w-7 h-7 bg-setu-700 rounded-full flex items-center justify-center flex-shrink-0">
															<MapPin className="w-3.5 h-3.5 text-white" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="text-[13px] font-semibold text-setu-900 truncate">
																{form.locationName}
															</p>
															<p className="text-[11px] text-gray-400">
																{form.latitude.toFixed(5)},{" "}
																{form.longitude.toFixed(5)}
															</p>
														</div>
														<button
															type="button"
															onClick={() =>
																setForm((f) => ({
																	...f,
																	locationName: "",
																	latitude: 0,
																	longitude: 0,
																}))
															}
															className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent flex-shrink-0">
															<X className="w-3.5 h-3.5" />
														</button>
													</div>
												) : (
													<p className="mt-2 text-[11px] text-gray-400">
														Click anywhere on the map or use "Locate me" to set
														the campaign location.
													</p>
												)}
											</div>

											{/* Beneficiary */}
											<div>
												<label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
													Who will benefit?{" "}
													<span className="text-gray-400 normal-case font-normal tracking-normal">
														(optional)
													</span>
												</label>
												<div
													className={`relative rounded-xl transition-all duration-200 ${focused === "ben" ? "ring-2 ring-setu-500/30" : ""}`}>
													<Users
														className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === "ben" ? "text-setu-600" : "text-gray-400"}`}
													/>
													<input
														type="text"
														value={form.beneficiary}
														onChange={(e) => set("beneficiary", e.target.value)}
														onFocus={() => setFocused("ben")}
														onBlur={() => setFocused(null)}
														placeholder="e.g. 200 families in Jajarkot district"
														className="w-full pl-11 pr-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
													/>
												</div>
											</div>

											{/* Tags */}
											<div>
												<label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
													Tags{" "}
													<span className="text-gray-400 normal-case font-normal tracking-normal">
														(optional)
													</span>
												</label>
												<div
													className={`relative rounded-xl transition-all duration-200 ${focused === "tags" ? "ring-2 ring-setu-500/30" : ""}`}>
													<Tag
														className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === "tags" ? "text-setu-600" : "text-gray-400"}`}
													/>
													<input
														type="text"
														value={form.tags}
														onChange={(e) => set("tags", e.target.value)}
														onFocus={() => setFocused("tags")}
														onBlur={() => setFocused(null)}
														placeholder="earthquake, shelter, urgent — comma separated"
														className="w-full pl-11 pr-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
													/>
												</div>
											</div>
										</>
									)}

									{/* ════ STEP 2: Story & Media ════ */}
									{step === 2 && (
										<>
											{/* Cover image — FIX 4: marked as required */}
											<div>
												<label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-3">
													Cover Image <span className="text-red-400">*</span>
												</label>
												<input
													ref={fileRef}
													type="file"
													accept="image/*"
													onChange={handleCoverChange}
													className="hidden"
												/>
												{coverPreview ? (
													<div className="relative rounded-2xl overflow-hidden border-2 border-setu-200 h-52">
														<img
															src={coverPreview}
															alt="Cover"
															className="w-full h-full object-cover"
														/>
														<button
															type="button"
															onClick={() => {
																setCoverPreview(null);
																setCoverFile(null);
															}}
															className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors">
															<X className="w-4 h-4 text-white" />
														</button>
													</div>
												) : (
													<button
														type="button"
														onClick={() => fileRef.current?.click()}
														className="w-full h-44 rounded-2xl border-2 border-dashed border-setu-200 bg-setu-50 hover:border-setu-400 hover:bg-setu-100 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer">
														<div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
															<Image className="w-5 h-5 text-setu-400" />
														</div>
														<div className="text-center">
															<p className="text-[13px] font-semibold text-setu-700">
																Click to upload cover photo
															</p>
															<p className="text-[11px] text-gray-400 mt-0.5">
																PNG, JPG up to 10MB — minimum 800×400px
															</p>
														</div>
													</button>
												)}
											</div>

											{/* Story */}
											<div>
												<label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
													Campaign Story <span className="text-red-400">*</span>
												</label>
												<textarea
													required
													value={form.story}
													onChange={(e) => set("story", e.target.value)}
													onFocus={() => setFocused("story")}
													onBlur={() => setFocused(null)}
													placeholder="Tell donors who you're helping, what happened, what the funds will be used for, and why it matters. Be honest and specific — donors connect with real stories."
													rows={9}
													maxLength={3000}
													className={[
														"w-full px-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors resize-none leading-relaxed",
														focused === "story"
															? "ring-2 ring-setu-500/30"
															: "",
													].join(" ")}
												/>
												<div className="flex justify-between mt-1.5">
													<p
														className={`text-[11px] ${form.story.length > 0 && form.story.length < 80 ? "text-red-400" : "text-gray-400"}`}>
														{form.story.length > 0 && form.story.length < 80
															? `${80 - form.story.length} more characters needed`
															: form.story.length >= 80
																? "Good length — the more detail the better"
																: "Minimum 80 characters"}
													</p>
													<p className="text-[11px] text-gray-400">
														{form.story.length}/3000
													</p>
												</div>
												<div className="mt-4 bg-setu-50 border border-setu-100 rounded-xl p-4">
													<p className="text-[11px] font-bold uppercase tracking-[0.1em] text-setu-600 mb-2">
														Writing prompts
													</p>
													<ul className="space-y-1.5">
														{[
															"Who is affected and how many people?",
															"What happened or what is the problem?",
															"How exactly will the funds be used?",
															"What changes when this goal is reached?",
														].map((p) => (
															<li
																key={p}
																className="flex items-start gap-2 text-[12px] text-setu-700">
																<div className="w-1.5 h-1.5 rounded-full bg-setu-400 mt-1.5 flex-shrink-0" />
																{p}
															</li>
														))}
													</ul>
												</div>
											</div>

											{/* Supporting doc */}
											<div>
												<label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
													Supporting Document{" "}
													<span className="text-gray-400 normal-case font-normal tracking-normal">
														(optional, speeds up verification)
													</span>
												</label>
												<button
													type="button"
													className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-dashed border-setu-200 hover:border-setu-400 hover:bg-setu-50 rounded-xl transition-all cursor-pointer">
													<div className="w-10 h-10 bg-setu-50 rounded-xl flex items-center justify-center flex-shrink-0">
														<Upload className="w-4 h-4 text-setu-500" />
													</div>
													<div className="text-left">
														<p className="text-[13px] font-semibold text-setu-700">
															Upload PDF or image
														</p>
														<p className="text-[11px] text-gray-400">
															Hospital records, government letters, photos — max
															20MB
														</p>
													</div>
												</button>
											</div>
										</>
									)}

									{/* ════ STEP 3: Goal & Timeline ════ */}
									{step === 3 && (
										<>
											{/* Goal amount */}
											<div>
												<label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
													Fundraising Goal (NPR){" "}
													<span className="text-red-400">*</span>
												</label>
												<div
													className={`relative rounded-xl transition-all duration-200 ${focused === "goal" ? "ring-2 ring-setu-500/30" : ""}`}>
													<div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
														<Target
															className={`w-4 h-4 transition-colors ${focused === "goal" ? "text-setu-600" : "text-gray-400"}`}
														/>
														<span className="text-[13px] font-bold text-gray-400 border-r border-setu-200 pr-2.5">
															NPR
														</span>
													</div>
													<input
														type="number"
														required
														min={10000}
														value={form.goal}
														onChange={(e) => set("goal", e.target.value)}
														onFocus={() => setFocused("goal")}
														onBlur={() => setFocused(null)}
														placeholder="e.g. 500000"
														className="w-full pl-24 pr-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
													/>
												</div>
												<div className="flex gap-2 flex-wrap mt-3">
													{[25000, 50000, 100000, 250000, 500000].map((amt) => (
														<button
															key={amt}
															type="button"
															onClick={() => set("goal", String(amt))}
															className={[
																"px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-150 cursor-pointer",
																form.goal === String(amt)
																	? "bg-setu-700 text-white border-setu-700"
																	: "bg-white text-setu-700 border-setu-200 hover:border-setu-400",
															].join(" ")}>
															{amt >= 100000
																? `${amt / 100000}L`
																: `${amt / 1000}K`}
														</button>
													))}
												</div>
												<p className="text-[11px] text-gray-400 mt-2">
													Minimum NPR 10,000. You can adjust this after
													approval.
												</p>
											</div>

											{/* Duration */}
											<div>
												<label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-3">
													Campaign Duration{" "}
													<span className="text-red-400">*</span>
												</label>
												<div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
													{durations.map(({ key, label }) => (
														<button
															key={key}
															type="button"
															onClick={() => set("duration", key)}
															className={[
																"flex flex-col items-center gap-1 p-3.5 rounded-xl border-2 transition-all duration-150 cursor-pointer",
																form.duration === key
																	? "bg-setu-50 border-setu-500"
																	: "bg-white border-setu-100 hover:border-setu-300",
															].join(" ")}>
															<Clock
																className={`w-4 h-4 ${form.duration === key ? "text-setu-600" : "text-gray-400"}`}
															/>
															<span
																className={`text-[13px] font-bold ${form.duration === key ? "text-setu-700" : "text-setu-900"}`}>
																{label}
															</span>
														</button>
													))}
												</div>
											</div>

											{/* Website */}
											<div>
												<label className="block text-xs font-bold text-setu-800 uppercase tracking-[0.1em] mb-2">
													Related Website{" "}
													<span className="text-gray-400 normal-case font-normal tracking-normal">
														(optional)
													</span>
												</label>
												<div
													className={`relative rounded-xl transition-all duration-200 ${focused === "website" ? "ring-2 ring-setu-500/30" : ""}`}>
													<Globe
														className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === "website" ? "text-setu-600" : "text-gray-400"}`}
													/>
													<input
														type="url"
														value={form.website}
														onChange={(e) => set("website", e.target.value)}
														onFocus={() => setFocused("website")}
														onBlur={() => setFocused(null)}
														placeholder="https://example.org"
														className="w-full pl-11 pr-4 py-3.5 bg-white border border-setu-200 rounded-xl text-sm text-setu-950 placeholder-gray-300 focus:outline-none focus:border-setu-500 transition-colors"
													/>
												</div>
											</div>

											{/* Fund breakdown */}
											<div className="bg-setu-50 border border-setu-100 rounded-2xl p-5">
												<p className="text-[12px] font-bold text-setu-700 uppercase tracking-[0.1em] mb-4">
													How Setu handles funds
												</p>
												<div className="space-y-3">
													{[
														{
															label: "Goes directly to your cause",
															pct: "95%",
															color: "bg-setu-600",
														},
														{
															label: "Platform operations",
															pct: "3%",
															color: "bg-setu-300",
														},
														{
															label: "Payment processing",
															pct: "2%",
															color: "bg-setu-200",
														},
													].map(({ label, pct, color }) => (
														<div
															key={label}
															className="flex items-center gap-3">
															<div
																className={`w-2.5 h-2.5 rounded-full ${color} flex-shrink-0`}
															/>
															<span className="text-[13px] text-setu-800 flex-1">
																{label}
															</span>
															<span className="text-[13px] font-bold text-setu-700">
																{pct}
															</span>
														</div>
													))}
												</div>
											</div>
										</>
									)}

									{/* ════ STEP 4: Review ════ */}
									{step === 4 && (
										<>
											{/* Summary card */}
											<div className="bg-white border border-setu-100 rounded-2xl overflow-hidden">
												<div className="px-6 py-4 bg-setu-50 border-b border-setu-100">
													<p className="text-[11px] font-bold uppercase tracking-[0.12em] text-setu-500">
														Campaign Summary
													</p>
												</div>
												{coverPreview && (
													<div className="h-40 overflow-hidden">
														<img
															src={coverPreview}
															alt="Cover"
															className="w-full h-full object-cover"
														/>
													</div>
												)}
												<div className="divide-y divide-setu-50">
													{[
														{ label: "Title", value: form.title },
														{ label: "Category", value: form.categoryName },
														{ label: "Location", value: form.locationName },
														{
															label: "Beneficiary",
															value: form.beneficiary || "—",
														},
														{
															label: "Goal",
															value: form.goal
																? `NPR ${Number(form.goal).toLocaleString()}`
																: "—",
														},
														{
															label: "Duration",
															value: form.duration
																? `${form.duration} days`
																: "—",
														},
														{ label: "Tags", value: form.tags || "—" },
													].map(({ label, value }) => (
														<div
															key={label}
															className="flex items-center justify-between px-6 py-3.5">
															<span className="text-[12px] text-gray-400 font-medium">
																{label}
															</span>
															<span className="text-[13px] font-semibold text-setu-900 text-right max-w-[200px] truncate">
																{value || "—"}
															</span>
														</div>
													))}
												</div>
												<div className="px-6 py-4 border-t border-setu-50">
													<p className="text-[11px] font-bold uppercase tracking-[0.1em] text-setu-500 mb-2">
														Story Preview
													</p>
													<p className="text-[13px] text-gray-600 leading-relaxed line-clamp-4">
														{form.story}
													</p>
												</div>
											</div>

											{/* Edit links */}
											<div className="flex gap-3 flex-wrap">
												{[
													{ n: 1, label: "Edit Basic Info" },
													{ n: 2, label: "Edit Story" },
													{ n: 3, label: "Edit Goal" },
												].map(({ n, label }) => (
													<button
														key={n}
														type="button"
														onClick={() => setStep(n)}
														className="text-[12px] font-semibold text-setu-600 hover:text-setu-500 underline underline-offset-2 cursor-pointer border-none bg-transparent transition-colors">
														{label}
													</button>
												))}
											</div>

											{/* Verification notice */}
											<div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
												<p className="text-[12px] font-bold text-amber-800 mb-1">
													Verification takes 24–48 hours
												</p>
												<p className="text-[12px] text-amber-700 leading-relaxed">
													Our team reviews every campaign for authenticity.
													You'll be notified by email once your campaign goes
													live.
												</p>
											</div>

											{/* Terms */}
											<div className="flex items-start gap-3">
												<input
													id="terms"
													type="checkbox"
													required
													checked={form.agreeTerms}
													onChange={(e) => set("agreeTerms", e.target.checked)}
													className="mt-0.5 w-4 h-4 rounded border-setu-300 text-setu-600 focus:ring-setu-500 cursor-pointer flex-shrink-0"
												/>
												<label
													htmlFor="terms"
													className="text-[12px] text-gray-500 leading-relaxed cursor-pointer">
													I confirm that all information provided is accurate
													and truthful. I agree to Setu's{" "}
													<Link
														href="/terms"
														className="text-setu-700 hover:underline font-medium">
														Terms of Service
													</Link>{" "}
													and{" "}
													<Link
														href="/privacy"
														className="text-setu-700 hover:underline font-medium">
														Campaign Guidelines
													</Link>
													. I understand that providing false information may
													result in account suspension.
												</label>
											</div>
										</>
									)}
								</div>

								{/* Footer nav */}
								<div className="px-8 py-6 border-t border-setu-50 bg-setu-50/30 flex items-center justify-between gap-4">
									{step > 1 ? (
										<button
											type="button"
											onClick={() => setStep((s) => s - 1)}
											disabled={submitting}
											className="flex items-center gap-2 px-5 py-3 bg-white border border-setu-200 text-setu-700 text-sm font-semibold rounded-xl hover:bg-setu-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
											<ArrowLeft className="w-4 h-4" /> Back
										</button>
									) : (
										<div />
									)}

									{step < 4 ? (
										<button
											type="button"
											onClick={() => setStep((s) => s + 1)}
											disabled={!canNext[step]}
											className="flex items-center gap-2 px-7 py-3 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_12px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer border-none">
											Continue <ArrowRight className="w-4 h-4" />
										</button>
									) : (
										<button
											type="submit"
											disabled={submitting || !form.agreeTerms}
											className="flex items-center gap-2 px-7 py-3 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_12px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 disabled:cursor-not-allowed cursor-pointer border-none">
											{submitting ? (
												<>
													<Loader2 className="w-4 h-4 animate-spin" />{" "}
													Submitting…
												</>
											) : (
												<>
													<Check className="w-4 h-4" /> Submit Campaign
												</>
											)}
										</button>
									)}
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* </div> */}
		</>
	);
}
