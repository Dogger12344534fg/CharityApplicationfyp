"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
	ArrowRight,
	Heart,
	Users,
	Package,
	Search,
	Zap,
	ShieldCheck,
	Eye,
	Trophy,
	Wheat,
	Shirt,
	Pill,
	Tent,
	ChevronRight,
	Star,
	MapPin,
	Clock,
	CheckCircle,
	Loader2,
} from "lucide-react";
import { CampaignCard, AllCampaignCard } from "@/src/components/campaign-card";
import { useGetAllCampaigns } from "@/src/hooks/useCampaign";
import { useGetLeaderboard } from "@/src/hooks/useHallOfFame";

// ── Animation Imports ─────────────────────────────────────────────
import { OrbitRings } from "@/src/components/OrbitRings";
import { FloatingCard } from "@/src/components/FloatingCard";
import {
	Reveal,
	RevealFade,
	RevealScale,
	StaggerList,
	StaggerItem,
} from "@/src/constants/MotionWrappers";

// ─────────────────────────────────────────────
// VIEWPORT CONFIG — shared constant
// ─────────────────────────────────────────────
const VIEWPORT = { once: true, amount: 0.2 } as const;

// ─────────────────────────────────────────────
// DATA (unchanged from original)
// ─────────────────────────────────────────────
const campaigns = [
	{
		id: "1",
		title: "Koshi Flood Relief 2024 — Immediate Aid for 500+ Families",
		desc: "Immediate assistance for families who lost everything. Providing shelter, food, and essentials for over 500 families in eastern Nepal.",
		img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=85&auto=format&fit=crop",
		raised: 362000,
		goal: 500000,
		donors: 2234,
		cat: "Emergency",
		catClass: "emergency",
		urgent: true,
		featured: true,
		location: "Eastern Nepal",
	},
	{
		id: "2",
		title: "Help Sunita Beat Cancer",
		desc: "A 32-year-old mother needs treatment at Bir Hospital. Help her fight stage 3 breast cancer.",
		img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80&auto=format&fit=crop",
		raised: 145000,
		goal: 275000,
		donors: 892,
		cat: "Medical",
		catClass: "medical",
		urgent: true,
		location: "Kathmandu",
	},
];

export default function HomePage() {
	const shouldReduce = useReducedMotion();

	const { data, isLoading } = useGetAllCampaigns({
		status: "active",
		limit: 6,
	});
	const apiCampaigns = data?.campaigns || [];
	const formattedCampaigns = apiCampaigns.map((c) => ({
		id: c._id,
		title: c.title,
		desc: c.description,
		img:
			c.images?.url ||
			"https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=85&auto=format&fit=crop",
		raised: c.raisedAmount || 0,
		goal: c.goalAmount,
		donors: c.donorsCount || 0,
		cat: c.category?.name || "Charity",
		catClass: c.category?.name?.toLowerCase().split(" ")[0] || "charity",
		urgent: c.urgent,
		location: c.location?.name || "Nepal",
	}));

	const featuredCampaigns = formattedCampaigns.slice(0, 5);
	const browseCampaigns = formattedCampaigns.slice(0, 6);

	const { data: leaderboardData, isLoading: leaderboardLoading } =
		useGetLeaderboard({
			donorLimit: 6,
			teamLimit: 0,
		});

	const donors = leaderboardData?.donors ?? [];
	const top3 = donors.slice(0, 3);
	const restDonors = donors.slice(3, 6);

	const fmtNPR = (n: number) =>
		n >= 100000
			? `NPR ${(n / 100000).toFixed(1)}L`
			: `NPR ${n.toLocaleString()}`;

	const podiumCfg: Record<number, any> = {
		1: {
			barH: "h-[145px]",
			barBg: "from-amber-100 to-amber-500",
			ring: "ring-amber-400",
			rankBg: "bg-amber-400",
			trophy: "gold",
			big: true,
		},
		2: {
			barH: "h-[110px]",
			barBg: "from-slate-200 to-slate-400",
			ring: "ring-slate-300",
			rankBg: "bg-slate-400",
			trophy: "silver",
		},
		3: {
			barH: "h-[88px]",
			barBg: "from-orange-200 to-orange-600",
			ring: "ring-orange-400",
			rankBg: "bg-orange-600",
			trophy: "bronze",
		},
	};

	const top3Display =
		top3.length >= 3
			? [
					{ ...top3[1], ...podiumCfg[2], rank: 2 },
					{ ...top3[0], ...podiumCfg[1], rank: 1 },
					{ ...top3[2], ...podiumCfg[3], rank: 3 },
				]
			: [];

	// Orbit category config
	const orbitCategories = [
		{
			href: "/campaigns?category=emergency",
			img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=356&q=85&auto=format&fit=crop",
			label: "Emergency",
			icon: Zap,
			iconColor: "text-orange-500",
			hoverBorder: "group-hover:border-orange-400",
			hoverShadow:
				"group-hover:shadow-[0_0_0_5px_rgba(234,88,12,0.15),0_8px_32px_rgba(234,88,12,0.25)]",
			hoverLabel:
				"group-hover:border-orange-300 group-hover:bg-orange-50 group-hover:shadow-[0_2px_12px_rgba(234,88,12,0.15)]",
			hoverText: "group-hover:text-orange-700",
			style: { right: "calc(50% + 270px)", top: "30px" },
			floatIndex: 0,
		},
		{
			href: "/campaigns?category=medical",
			img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=356&q=85&auto=format&fit=crop",
			label: "Medical",
			icon: Heart,
			iconColor: "text-red-500",
			hoverBorder: "group-hover:border-red-400",
			hoverShadow:
				"group-hover:shadow-[0_0_0_5px_rgba(239,68,68,0.15),0_8px_32px_rgba(239,68,68,0.25)]",
			hoverLabel:
				"group-hover:border-red-300 group-hover:bg-red-50 group-hover:shadow-[0_2px_12px_rgba(239,68,68,0.15)]",
			hoverText: "group-hover:text-red-700",
			style: {
				right: "calc(50% + 310px)",
				top: "50%",
				transform: "translateY(-50%)",
			},
			floatIndex: 1,
		},
		{
			href: "/campaigns?category=education",
			img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=356&q=85&auto=format&fit=crop",
			label: "Education",
			icon: Eye,
			iconColor: "text-blue-500",
			hoverBorder: "group-hover:border-blue-400",
			hoverShadow:
				"group-hover:shadow-[0_0_0_5px_rgba(59,130,246,0.15),0_8px_32px_rgba(59,130,246,0.25)]",
			hoverLabel:
				"group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:shadow-[0_2px_12px_rgba(59,130,246,0.15)]",
			hoverText: "group-hover:text-blue-700",
			style: { right: "calc(50% + 270px)", bottom: "30px" },
			floatIndex: 2,
		},
		{
			href: "/campaigns?category=animals",
			img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=356&q=85&auto=format&fit=crop",
			label: "Animals",
			icon: ShieldCheck,
			iconColor: "text-purple-500",
			hoverBorder: "group-hover:border-purple-400",
			hoverShadow:
				"group-hover:shadow-[0_0_0_5px_rgba(168,85,247,0.15),0_8px_32px_rgba(168,85,247,0.25)]",
			hoverLabel:
				"group-hover:border-purple-300 group-hover:bg-purple-50 group-hover:shadow-[0_2px_12px_rgba(168,85,247,0.15)]",
			hoverText: "group-hover:text-purple-700",
			style: { left: "calc(50% + 270px)", top: "30px" },
			floatIndex: 3,
		},
		{
			href: "/campaigns?category=charity",
			img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=356&q=85&auto=format&fit=crop",
			label: "Charity",
			icon: Users,
			iconColor: "text-setu-500",
			hoverBorder: "group-hover:border-setu-500",
			hoverShadow:
				"group-hover:shadow-[0_0_0_5px_rgba(42,165,88,0.15),0_8px_32px_rgba(42,165,88,0.25)]",
			hoverLabel:
				"group-hover:border-setu-400 group-hover:bg-setu-50 group-hover:shadow-[0_2px_12px_rgba(42,165,88,0.15)]",
			hoverText: "group-hover:text-setu-700",
			style: {
				left: "calc(50% + 310px)",
				top: "50%",
				transform: "translateY(-50%)",
			},
			floatIndex: 4,
		},
		{
			href: "/donations/goods",
			img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=85&auto=format&fit=crop",
			label: "Goods",
			icon: Package,
			iconColor: "text-amber-500",
			hoverBorder: "group-hover:border-amber-400",
			hoverShadow:
				"group-hover:shadow-[0_0_0_5px_rgba(245,158,11,0.15),0_8px_32px_rgba(245,158,11,0.25)]",
			hoverLabel:
				"group-hover:border-amber-300 group-hover:bg-amber-50 group-hover:shadow-[0_2px_12px_rgba(245,158,11,0.15)]",
			hoverText: "group-hover:text-amber-700",
			style: { left: "calc(50% + 270px)", bottom: "30px" },
			floatIndex: 5,
		},
	];

	return (
		<div
			className="bg-cream text-setu-950"
			style={{ fontFamily: "var(--font-body)" }}>
			{/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
			<section className="bg-cream pt-7 pb-0 overflow-hidden relative">
				{/* Background image — not animated (expensive) */}
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						backgroundImage:
							"url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=60&auto=format&fit=crop')",
						backgroundSize: "cover",
						backgroundPosition: "center 40%",
						opacity: 0.9,
						filter: "blur(0.1px) saturate(0.8)",
					}}
				/>
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						background:
							"radial-gradient(ellipse 90% 85% at 50% 50%, transparent 60%, #919391ff 85%)",
					}}
				/>
				{/* Center text readability overlay */}
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						background:
							"radial-gradient(ellipse 62% 72% at 50% 46%, rgba(255, 250, 240, 0.60) 0%, rgba(255,250,240,0.62) 38%, rgba(255,250,240,0.18) 65%, transparent 80%)",
					}}
				/>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
					{/* Top badge */}
					<RevealFade className="flex justify-center mb-8">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-setu-50 border border-setu-200 rounded-full">
							<span className="w-2 h-2 rounded-full bg-setu-500 animate-pulse flex-shrink-0" />
							<span className="text-[13px] font-semibold text-setu-700 tracking-wide">
								Nepal&apos;s First Unified Donation Platform
							</span>
						</div>
					</RevealFade>

					{/* ── Desktop orbital layout ── */}
					<div
						className="relative hidden lg:flex items-center justify-center"
						style={{ height: "720px" }}>
						{/* ── ANIMATED ORBIT RINGS ── */}
						<OrbitRings />

						{/* ── FLOATING CATEGORY CARDS ── */}
						{orbitCategories.map((cat) => {
							const Icon = cat.icon;
							return (
								<div
									key={cat.label}
									className="absolute z-20"
									style={cat.style}>
									<FloatingCard
										floatIndex={cat.floatIndex}
										className="group flex flex-col items-center gap-2.5">
										<Link
											href={cat.href}
											className="group flex flex-col items-center gap-2.5">
											<motion.div
												className={`w-[178px] h-[178px] rounded-full overflow-hidden border-4 border-white shadow-[0_8px_32px_rgba(21,104,57,0.15)] ${cat.hoverBorder} ${cat.hoverShadow} transition-shadow duration-300`}
												whileHover={shouldReduce ? {} : { scale: 1.05 }}
												transition={{
													duration: 0.25,
													ease: [0.34, 1.56, 0.64, 1],
												}}>
												<motion.img
													src={cat.img}
													alt={cat.label}
													className="w-full h-full object-cover"
													whileHover={shouldReduce ? {} : { scale: 1.1 }}
													transition={{
														duration: 0.5,
														ease: [0.42, 0, 0.58, 1],
													}}
												/>
											</motion.div>
											<div
												className={`flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-setu-100 ${cat.hoverLabel} transition-all duration-200`}>
												<Icon
													className={`w-3.5 h-3.5 ${cat.iconColor} flex-shrink-0`}
												/>
												<span
													className={`text-[13px] font-bold text-setu-800 ${cat.hoverText} transition-colors`}>
													{cat.label}
												</span>
											</div>
										</Link>
									</FloatingCard>
								</div>
							);
						})}

						{/* ── Center CTA ── */}
						<div className="relative z-10 text-center w-[480px]">
							<Reveal delay={0.1}>
								<h1
									className="text-[clamp(48px,4.5vw,72px)] font-bold leading-[1.02] tracking-[-2.5px] text-setu-950 mb-5"
									style={{ fontFamily: "var(--font-display)", textShadow: "0 1px 12px rgba(255,250,240,0.9), 0 2px 24px rgba(255,250,240,0.6)" }}>
									Donate Hope.
									<br />
									<em className="italic text-setu-600">Change Nepal.</em>
								</h1>
							</Reveal>

							<Reveal delay={0.22}>
								<p className="text-[16px] text-setu-900 font-semibold leading-[1.75] mb-9 px-4" style={{ textShadow: "0 1px 8px rgba(255,250,240,0.8)" }}>
									Connect with causes that matter. Give money, donate goods, or
									start a campaign — every act of kindness matters.
								</p>
							</Reveal>

							<Reveal delay={0.34}>
								<div className="flex items-center justify-center flex-wrap gap-3 mb-10">
									<motion.div
										whileHover={shouldReduce ? {} : { y: -2, scale: 1.02 }}
										whileTap={shouldReduce ? {} : { scale: 0.98 }}
										transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}>
										<Link
											href="/register"
											className="inline-flex items-center gap-2 px-8 py-4 bg-setu-700 hover:bg-setu-600 text-white text-[15px] font-bold rounded-full no-underline transition-colors duration-200 shadow-[0_8px_24px_rgba(21,104,57,0.35)] hover:shadow-[0_12px_32px_rgba(21,104,57,0.45)]">
											Start a Campaign
											<ArrowRight className="w-4 h-4" />
										</Link>
									</motion.div>
									<motion.div
										whileHover={shouldReduce ? {} : { y: -2 }}
										whileTap={shouldReduce ? {} : { scale: 0.98 }}
										transition={{ duration: 0.2 }}>
										<Link
											href="/campaigns"
											className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-setu-200 hover:border-setu-400 hover:bg-setu-50 text-setu-700 text-[15px] font-semibold rounded-full no-underline transition-all duration-200 shadow-sm">
											<Search className="w-4 h-4" />
											Browse Campaigns
										</Link>
									</motion.div>
								</div>
							</Reveal>
						</div>
					</div>

					{/* ── Mobile layout ── */}
					<div className="lg:hidden pt-4 pb-2">
						<div className="text-center mb-8">
							<Reveal>
								<h1
									className="text-[clamp(40px,8vw,56px)] font-bold leading-[1.04] tracking-[-2px] text-setu-950 mb-4"
									style={{ fontFamily: "var(--font-display)", textShadow: "0 1px 12px rgba(255,250,240,0.9), 0 2px 24px rgba(255,250,240,0.6)" }}>
									Donate Hope.
									<br />
									<em className="italic text-setu-600">Change Nepal.</em>
								</h1>
							</Reveal>
							<Reveal delay={0.12}>
								<p className="text-[15px] text-setu-900 font-medium leading-[1.75] mb-8 max-w-sm mx-auto" style={{ textShadow: "0 1px 8px rgba(255,250,240,0.8)" }}>
									Connect with causes that matter. Give money, donate goods, or
									start a campaign.
								</p>
							</Reveal>
							<Reveal delay={0.22}>
								<div className="flex items-center justify-center flex-wrap gap-3 mb-8">
									<Link
										href="/register"
										className="inline-flex items-center gap-2 px-7 py-3.5 bg-setu-700 hover:bg-setu-600 text-white text-[14px] font-bold rounded-full no-underline transition-all duration-200 shadow-[0_8px_24px_rgba(21,104,57,0.35)]">
										Start a Campaign <ArrowRight className="w-4 h-4" />
									</Link>
									<Link
										href="/campaigns"
										className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border-2 border-setu-200 hover:border-setu-400 text-setu-700 text-[14px] font-semibold rounded-full no-underline transition-all duration-200">
										<Search className="w-4 h-4" /> Browse
									</Link>
								</div>
							</Reveal>
						</div>
						{/* Mobile category grid — simple fade, no float */}
						<StaggerList
							className="grid grid-cols-3 gap-4"
							slow>
							{[
								{
									icon: Zap,
									label: "Emergency",
									href: "/campaigns?category=emergency",
									img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&q=70&auto=format&fit=crop",
									iconColor: "text-orange-500",
								},
								{
									icon: Heart,
									label: "Medical",
									href: "/campaigns?category=medical",
									img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=200&q=70&auto=format&fit=crop",
									iconColor: "text-red-500",
								},
								{
									icon: Eye,
									label: "Education",
									href: "/campaigns?category=education",
									img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=200&q=70&auto=format&fit=crop",
									iconColor: "text-blue-500",
								},
								{
									icon: Package,
									label: "Goods",
									href: "/donations/goods",
									img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=200&q=70&auto=format&fit=crop",
									iconColor: "text-amber-500",
								},
								{
									icon: Users,
									label: "Charity",
									href: "/campaigns?category=charity",
									img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&q=70&auto=format&fit=crop",
									iconColor: "text-setu-500",
								},
								{
									icon: ShieldCheck,
									label: "Animals",
									href: "/campaigns?category=animals",
									img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&q=70&auto=format&fit=crop",
									iconColor: "text-purple-500",
								},
							].map(({ icon: Icon, label, href, img, iconColor }) => (
								<StaggerItem key={label}>
									<Link
										href={href}
										className="group flex flex-col items-center gap-2">
										<div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-white shadow-lg group-hover:scale-105 group-hover:shadow-[0_0_0_3px_rgba(21,104,57,0.15)] transition-all duration-200">
											<img
												src={img}
												alt={label}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex items-center gap-1.5">
											<Icon
												className={`w-3.5 h-3.5 ${iconColor} flex-shrink-0`}
											/>
											<span className="text-[12px] font-semibold text-setu-800">
												{label}
											</span>
										</div>
									</Link>
								</StaggerItem>
							))}
						</StaggerList>
					</div>

					{/* Stats bar */}
					<StaggerList className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-8 mt-24">
						{[
							{ icon: Users, label: "18,400+ Donors" },
							{ icon: ShieldCheck, label: "Verified Campaigns" },
							{ icon: Zap, label: "Real-Time Tracking" },
							{ icon: Package, label: "4,800+ Goods Sent" },
						].map(({ icon: Icon, label }) => (
							<StaggerItem key={label}>
								<motion.div
									className="flex items-center gap-3 px-5 py-1 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 rounded-full transition-colors duration-200 cursor-default"
									whileHover={shouldReduce ? {} : { y: -2 }}
									transition={{ duration: 0.2 }}>
									<div className="w-8 h-8 rounded-full bg-setu-500/40 border border-setu-400/50 flex items-center justify-center flex-shrink-0">
										<Icon className="w-4 h-4 text-white" />
									</div>
									<span className="text-[14px] font-bold text-white tracking-wide whitespace-nowrap">
										{label}
									</span>
								</motion.div>
							</StaggerItem>
						))}
					</StaggerList>
				</div>
			</section>

			{/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
			<section className="py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-end justify-between mb-16">
						<Reveal>
							<div>
								<div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
									<div className="w-6 h-[2px] bg-setu-500 rounded" />
									Simple & Transparent
								</div>
								<h2
									className="text-[clamp(32px,4vw,50px)] font-bold text-setu-950 leading-tight tracking-[-0.5px]"
									style={{ fontFamily: "var(--font-display)" }}>
									How Setu Works
								</h2>
							</div>
						</Reveal>
						<RevealFade delay={0.2}>
							<Link
								href="/how-it-works"
								className="hidden sm:flex items-center gap-1.5 text-[14px] font-semibold text-setu-600 hover:text-setu-500 no-underline transition-colors">
								Learn more <ChevronRight className="w-4 h-4" />
							</Link>
						</RevealFade>
					</div>

					<StaggerList
						className="grid grid-cols-1 md:grid-cols-3 gap-px bg-setu-100 rounded-3xl overflow-hidden"
						slow>
						{[
							{
								n: "01",
								icon: Search,
								title: "Create or Find a Campaign",
								desc: "Start your own fundraiser or browse hundreds of verified campaigns across medical, education, and disaster relief categories.",
							},
							{
								n: "02",
								icon: Heart,
								title: "Donate Money or Goods",
								desc: "Contribute cash via secure payment or donate physical goods — rice, clothes, medicine — for immediate disaster relief across Nepal.",
							},
							{
								n: "03",
								icon: Eye,
								title: "Track Real-Time Impact",
								desc: "See exactly where your donation goes with transparent tracking, live updates, and detailed campaign reports at every stage.",
							},
						].map(({ n, icon: Icon, title, desc }) => (
							<StaggerItem key={n}>
								<motion.div
									className="bg-white px-8 lg:px-10 py-12 relative group hover:bg-setu-50 transition-colors duration-200 h-full"
									whileHover={shouldReduce ? {} : { y: -3 }}
									transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}>
									<span
										className="absolute top-7 right-8 text-[80px] lg:text-[88px] font-bold text-setu-100 leading-none select-none group-hover:text-setu-200 transition-colors"
										style={{ fontFamily: "var(--font-display)" }}>
										{n}
									</span>
									<div className="w-14 h-14 bg-setu-700 rounded-2xl flex items-center justify-center mb-7 shadow-[0_8px_20px_rgba(21,104,57,0.25)] group-hover:bg-setu-600 transition-colors">
										<Icon className="w-6 h-6 text-white" />
									</div>
									<h3
										className="text-[20px] font-bold text-setu-950 mb-3"
										style={{ fontFamily: "var(--font-display)" }}>
										{title}
									</h3>
									<p className="text-[14px] text-gray-500 leading-[1.7]">
										{desc}
									</p>
								</motion.div>
							</StaggerItem>
						))}
					</StaggerList>
				</div>
			</section>


			

			{/* ══════════════════════════════════════════
          FEATURED CAMPAIGNS
      ══════════════════════════════════════════ */}
			<section className="py-24 bg-setu-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-end justify-between mb-12">
						<Reveal>
							<div>
								<div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
									<div className="w-6 h-[2px] bg-setu-500 rounded" />
									Making a Difference
								</div>
								<h2
									className="text-[clamp(32px,4vw,50px)] font-bold text-setu-950 leading-tight tracking-[-0.5px]"
									style={{ fontFamily: "var(--font-display)" }}>
									Featured Campaigns
								</h2>
							</div>
						</Reveal>
						<RevealFade delay={0.2}>
							<Link
								href="/campaigns"
								className="hidden sm:flex items-center gap-1.5 text-[14px] font-semibold text-setu-600 hover:text-setu-500 no-underline transition-colors">
								View all <ChevronRight className="w-4 h-4" />
							</Link>
						</RevealFade>
					</div>
					<StaggerList
						className="grid grid-cols-1 md:grid-cols-3 gap-6"
						slow>
						{isLoading ? (
							<div className="col-span-1 md:col-span-3 flex justify-center py-12">
								<Loader2 className="w-8 h-8 animate-spin text-setu-500" />
							</div>
						) : featuredCampaigns.length > 0 ? (
							featuredCampaigns.map((c, i) => (
								<StaggerItem
									key={c.id}
									className={i === 0 ? "md:col-span-2" : ""}>
									<CampaignCard
										c={c}
										large={i === 0}
									/>
								</StaggerItem>
							))
						) : (
							<div className="col-span-1 md:col-span-3 text-center py-12 text-gray-500">
								No featured campaigns found.
							</div>
						)}
					</StaggerList>
				</div>
			</section>

			{/* ══════════════════════════════════════════
          BROWSE CAMPAIGNS
      ══════════════════════════════════════════ */}
			<section className="py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
						<Reveal>
							<div>
								<div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
									<div className="w-6 h-[2px] bg-setu-500 rounded" />
									Explore All
								</div>
								<h2
									className="text-[clamp(30px,4vw,46px)] font-bold text-setu-950 leading-tight tracking-[-0.5px]"
									style={{ fontFamily: "var(--font-display)" }}>
									Browse Campaigns
								</h2>
								<p className="text-[14px] text-gray-500 mt-2">
									Discover causes that matter — from medical emergencies to
									disaster relief.
								</p>
							</div>
						</Reveal>
						<RevealFade delay={0.15}>
							<Link
								href="/campaigns"
								className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-setu-700 hover:bg-setu-600 text-white text-[13px] font-bold rounded-full no-underline transition-all duration-200 shadow-[0_4px_12px_rgba(21,104,57,0.3)] w-fit">
								View All Campaigns <ArrowRight className="w-3.5 h-3.5" />
							</Link>
						</RevealFade>
					</div>

					<StaggerList
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
						slow>
						{isLoading ? (
							<div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center py-12">
								<Loader2 className="w-8 h-8 animate-spin text-setu-500" />
							</div>
						) : browseCampaigns.length > 0 ? (
							browseCampaigns.map((c) => (
								<StaggerItem key={c.id}>
									<AllCampaignCard c={c} />
								</StaggerItem>
							))
						) : (
							<div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
								No campaigns found.
							</div>
						)}
					</StaggerList>

					<RevealFade delay={0.1}>
						<div className="flex justify-center mt-12">
							<Link
								href="/campaigns"
								className="inline-flex items-center gap-2 px-8 py-3.5 bg-setu-50 hover:bg-setu-100 border border-setu-200 text-setu-700 text-[14px] font-semibold rounded-full no-underline transition-all duration-200">
								Load More Campaigns <ChevronRight className="w-4 h-4" />
							</Link>
						</div>
					</RevealFade>
				</div>
			</section>

			{/* ══════════════════════════════════════════
          HALL OF FAME
      ══════════════════════════════════════════ */}
			<section className="py-24 bg-setu-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<Reveal>
						<div className="text-center mb-16">
							<div className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
								<div className="w-6 h-[2px] bg-setu-500 rounded" />
								Top Contributors
								<div className="w-6 h-[2px] bg-setu-500 rounded" />
							</div>
							<h2
								className="text-[clamp(32px,4vw,50px)] font-bold text-setu-950 leading-tight tracking-[-0.5px] mb-3"
								style={{ fontFamily: "var(--font-display)" }}>
								Hall of Fame
							</h2>
							<p className="text-[14px] text-gray-500 max-w-sm mx-auto">
								Recognizing our most generous donors who are changing lives
								across Nepal every day.
							</p>
						</div>
					</Reveal>

					{/* Podium */}
					<StaggerList className="flex items-end justify-center gap-4 sm:gap-6 mb-16">
						{leaderboardLoading ? (
							<div className="flex justify-center py-12">
								<Loader2 className="w-8 h-8 animate-spin text-setu-500" />
							</div>
						) : top3Display.length > 0 ? (
							top3Display.map(
								({
									name,
									totalDonated,
									avatar,
									rank,
									barH,
									barBg,
									ring,
									rankBg,
									trophy,
									big,
								}) => (
									<StaggerItem key={rank}>
										<motion.div
											className="flex flex-col items-center group cursor-pointer"
											whileHover={
												shouldReduce
													? {}
													: {
															y: -8,
															scale: 1.03,
															filter:
																"drop-shadow(0 20px 32px rgba(21, 104, 57, 0.15))",
														}
											}
											transition={{
												duration: 0.3,
												ease: [0.34, 1.56, 0.64, 1],
											}}>
											<div className="relative mb-3 transition-transform duration-300 group-hover:-translate-y-1">
												{avatar ? (
													<img
														src={avatar}
														alt={name}
														className={[
															"rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-[1.08]",
															big ? "w-20 h-20" : "w-16 h-16",
															"ring-2",
															ring,
														].join(" ")}
													/>
												) : (
													<div
														className={[
															"rounded-full bg-gradient-to-br from-setu-700 to-setu-500 flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-[1.08]",
															big ? "w-20 h-20" : "w-16 h-16",
															"ring-2",
															ring,
														].join(" ")}>
														<span
															className="text-white font-black"
															style={{ fontSize: big ? 28 : 22 }}>
															{name?.[0]?.toUpperCase() ?? "?"}
														</span>
													</div>
												)}
												<div
													className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${rankBg} text-white flex items-center justify-center text-[11px] font-black border-2 border-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
													{rank}
												</div>
											</div>
											<p
												className={`font-bold text-setu-900 text-center mb-0.5 group-hover:text-setu-700 transition-colors ${big ? "text-[15px]" : "text-[13px]"}`}>
												{name}
											</p>
											<p
												className={`font-semibold text-setu-600 text-center mb-3 ${big ? "text-[14px]" : "text-[12px]"}`}>
												{fmtNPR(totalDonated)}
											</p>
											<div
												className={`w-24 sm:w-28 ${barH} bg-gradient-to-b ${barBg} rounded-t-xl flex items-start justify-center pt-4 transition-all duration-300 group-hover:brightness-110 group-hover:shadow-[inset_0_4px_12px_rgba(255,255,255,0.4)]`}>
												<Trophy
													className={`${big ? "w-7 h-7" : "w-5 h-5"} transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${
														trophy === "gold"
															? "text-amber-600"
															: trophy === "silver"
																? "text-slate-500"
																: "text-orange-700"
													}`}
												/>
											</div>
										</motion.div>
									</StaggerItem>
								),
							)
						) : null}
					</StaggerList>

					{/* Leaderboard rows */}
					<StaggerList className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[820px] mx-auto">
						{!leaderboardLoading &&
							restDonors.map((d) => (
								<StaggerItem key={d.rank}>
									<motion.div
										className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-setu-100 hover:bg-setu-50 transition-colors duration-200 cursor-pointer"
										whileHover={shouldReduce ? {} : { x: 4 }}
										transition={{ duration: 0.2 }}>
										<div className="w-8 h-8 bg-setu-700 text-white rounded-lg flex items-center justify-center text-[12px] font-black flex-shrink-0">
											{d.rank}
										</div>
										{d.avatar ? (
											<img
												src={d.avatar}
												alt={d.name}
												className="w-9 h-9 rounded-full border-2 border-setu-200 object-cover flex-shrink-0"
											/>
										) : (
											<div className="w-9 h-9 rounded-full bg-gradient-to-br from-setu-700 to-setu-500 flex items-center justify-center flex-shrink-0 border-2 border-setu-200">
												<span className="text-white font-black text-[12px]">
													{d.name?.[0]?.toUpperCase() ?? "?"}
												</span>
											</div>
										)}
										<div className="min-w-0">
											<p className="text-[14px] font-bold text-setu-900 truncate">
												{d.name}
											</p>
											<p className="text-[12px] font-medium text-setu-600">
												{fmtNPR(d.totalDonated)}
											</p>
										</div>
									</motion.div>
								</StaggerItem>
							))}
					</StaggerList>
				</div>
			</section>

			{/* ══════════════════════════════════════════
          GOODS DONATION
      ══════════════════════════════════════════ */}
			<section className="py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<RevealScale>
						<div className="group relative grid md:grid-cols-2 bg-setu-950 transition-colors duration-1000 hover:bg-setu-900 rounded-[32px] overflow-hidden min-h-[460px] shadow-xl hover:shadow-2xl">
							{/* Soft Shimmer sweep effect across the entire banner */}
							<div className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent translate-x-[-150%] skew-x-[-15deg] transition-transform duration-1000 ease-in-out group-hover:translate-x-[150%] pointer-events-none" />

							<div className="relative z-10 flex flex-col justify-center px-8 sm:px-14 py-16">
								<RevealFade delay={0.1}>
									<div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-300 mb-6 transition-colors duration-500 group-hover:text-setu-200">
										<div className="w-5 h-[2px] bg-setu-400 rounded transition-all duration-500 group-hover:w-8 group-hover:bg-setu-300" />
										Beyond Money
									</div>
								</RevealFade>
								<Reveal delay={0.18}>
									<h2
										className="text-[clamp(28px,3.5vw,44px)] font-bold text-white leading-tight mb-5 tracking-[-0.5px]"
										style={{ fontFamily: "var(--font-display)" }}>
										Donate{" "}
										<em className="italic text-setu-300 transition-colors duration-500 group-hover:text-setu-200">
											Goods
										</em>
										<br />
										During Disasters
									</h2>
								</Reveal>
								<Reveal delay={0.26}>
									<p className="text-[15px] text-white/60 leading-[1.75] max-w-[380px] mb-9 transition-colors duration-500 group-hover:text-white/80">
										Send rice, clothes, medicine, and relief supplies directly
										to communities hit by floods, earthquakes, and emergencies
										across Nepal.
									</p>
								</Reveal>
								<Reveal delay={0.32}>
									<div className="flex flex-wrap gap-2.5 mb-9 z-30 relative">
										{[
											{ icon: Wheat, label: "Rice & Food" },
											{ icon: Shirt, label: "Clothes" },
											{ icon: Pill, label: "Medicine" },
											{ icon: Tent, label: "Shelter" },
										].map(({ icon: Icon, label }) => (
											<div
												key={label}
												className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.12] rounded-full transition-all duration-300 group-hover:bg-setu-500/20 group-hover:border-setu-400/30 group-hover:-translate-y-0.5">
												<Icon className="w-3.5 h-3.5 text-setu-300 transition-colors group-hover:text-setu-200" />
												<span className="text-[13px] font-medium text-white/80 transition-colors group-hover:text-white">
													{label}
												</span>
											</div>
										))}
									</div>
								</Reveal>
								<Reveal delay={0.38}>
									<div className="flex gap-4 flex-wrap items-center z-30 relative">
										<motion.div
											whileHover={shouldReduce ? {} : { y: -2 }}
											whileTap={shouldReduce ? {} : { scale: 0.98 }}
											transition={{ duration: 0.2 }}>
											<Link
												href="/donations/goods"
												className="px-7 py-3.5 bg-white text-setu-800 text-[14px] font-bold rounded-full no-underline hover:bg-setu-50 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.15)] group-hover:shadow-[0_8px_24px_rgba(42,165,88,0.3)]">
												Donate Goods Now
											</Link>
										</motion.div>
										<motion.div
											whileHover={shouldReduce ? {} : { x: 4 }}
											transition={{ duration: 0.2 }}>
											<Link
												href="/how-it-works"
												className="flex items-center gap-1.5 px-7 py-3.5 border-[1.5px] border-white/25 text-white text-[14px] font-semibold rounded-full no-underline hover:bg-white/[0.08] transition-colors group-hover:border-white/40">
												Learn More <ChevronRight className="w-4 h-4" />
											</Link>
										</motion.div>
									</div>
								</Reveal>
							</div>
							<div className="relative overflow-hidden min-h-[300px]">
								<img
									src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=85&auto=format&fit=crop"
									alt="Disaster relief volunteers"
									className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.08] group-hover:rotate-1 z-0"
								/>
								<div className="absolute inset-0 bg-gradient-to-r from-setu-950 via-setu-950/40 to-transparent transition-colors duration-1000 group-hover:from-setu-900 group-hover:via-setu-900/40 z-10 pointer-events-none" />
							</div>
						</div>
					</RevealScale>
				</div>
			</section>

			{/* ══════════════════════════════════════════
          TRUST SIGNALS
      ══════════════════════════════════════════ */}
			<section className="py-20 bg-setu-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<StaggerList
						className="grid grid-cols-1 md:grid-cols-3 gap-8"
						slow>
						{[
							{
								icon: ShieldCheck,
								title: "Secure Payments",
								desc: "256-bit SSL encryption on every transaction. Your financial data is never stored on our servers.",
								color: "text-setu-600",
								bg: "bg-setu-50",
							},
							{
								icon: CheckCircle,
								title: "Verified Campaigns",
								desc: "Every campaign is manually reviewed by our team. We verify identities, documents, and cause legitimacy.",
								color: "text-blue-600",
								bg: "bg-blue-50",
							},
							{
								icon: Eye,
								title: "Transparent Impact",
								desc: "Track every rupee in real-time. Detailed reports show exactly how funds are spent and who they reach.",
								color: "text-amber-600",
								bg: "bg-amber-50",
							},
						].map(({ icon: Icon, title, desc, color, bg }) => (
							<StaggerItem key={title}>
								<motion.div
									className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-setu-100 transition-all duration-500 h-full relative overflow-hidden"
									whileHover={
										shouldReduce
											? {}
											: {
													y: -8,
													scale: 1.02,
													boxShadow: "0 24px 48px rgba(21,104,57,0.08)",
												}
									}
									transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
									{/* Subtle background glow effect on hover */}
									<div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-setu-50/50 via-transparent to-transparent transition-opacity duration-500 pointer-events-none" />

									<div
										className={`relative w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-sm`}>
										<Icon
											className={`w-6 h-6 ${color} transition-transform duration-300 group-hover:scale-110`}
										/>
									</div>
									<h3
										className="relative text-[18px] font-bold text-setu-950 mb-2 transition-colors duration-300 group-hover:text-setu-700"
										style={{ fontFamily: "var(--font-display)" }}>
										{title}
									</h3>
									<p className="relative text-[14px] text-gray-500 leading-[1.7] transition-colors duration-300 group-hover:text-gray-700">
										{desc}
									</p>
								</motion.div>
							</StaggerItem>
						))}
					</StaggerList>
				</div>
			</section>

			{/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
			<section className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<Reveal>
						<div className="text-center mb-12">
							<div className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
								<div className="w-6 h-[2px] bg-setu-500 rounded" />
								Real Stories
								<div className="w-6 h-[2px] bg-setu-500 rounded" />
							</div>
							<h2
								className="text-[clamp(30px,4vw,46px)] font-bold text-setu-950 tracking-[-0.5px]"
								style={{ fontFamily: "var(--font-display)" }}>
								Voices of Change
							</h2>
						</div>
					</Reveal>

					<StaggerList
						className="grid grid-cols-1 md:grid-cols-3 gap-6"
						slow>
						{[
							{
								img: "/rochak.jpg",
								name: "Rochak Maharjan",
								role: "Top Donor · Kathmandu",
								quote:
									"Setu made it incredibly simple to help flood victims. I could see in real-time exactly where my money went. This is transparency done right.",
							},
							{
								img: "/nabin.jpg",
								name: "Nabin Lamsal",
								role: "Campaign Creator · Gulmi",
								quote:
									"We raised NPR 3 lakhs in just 2 weeks for our school's library. The platform is so easy to use and the team is always ready to help.",
							},
							{
								img: "/bishwas.jpg",
								name: "Bishwas Chhantyal",
								role: "Charity Org · Myagdi",
								quote:
									"Partnering with Setu for our medical camps has been transformative. Goods donations arrive faster, and every donor can track their impact.",
							},
						].map(({ img, name, role, quote }) => (
							<StaggerItem key={name}>
								<motion.div
									className="group relative overflow-hidden bg-setu-50 rounded-2xl p-7 border border-setu-100 transition-all duration-500 h-full cursor-default"
									whileHover={
										shouldReduce
											? {}
											: {
													y: -8,
													scale: 1.02,
													boxShadow: "0 24px 48px rgba(21,104,57,0.08)",
												}
									}
									transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
									{/* Subtle background glow effect */}
									<div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/80 via-white/10 to-transparent transition-opacity duration-500 pointer-events-none" />

									<div className="relative flex gap-1 mb-4 transition-transform duration-300 group-hover:scale-105 group-hover:translate-x-1 origin-left">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="w-4 h-4 text-amber-400 fill-amber-400"
											/>
										))}
									</div>
									<p className="relative text-[14px] text-gray-600 leading-[1.75] mb-6 italic transition-colors duration-300 group-hover:text-setu-900">
										&quot;{quote}&quot;
									</p>
									<div className="relative flex items-center gap-3 pt-5 border-t border-setu-100 transition-colors duration-300 group-hover:border-setu-200">
										<img
											src={img}
											alt={name}
											className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-md"
										/>
										<div>
											<p className="text-[14px] font-bold text-setu-900 transition-colors duration-300 group-hover:text-setu-700">
												{name}
											</p>
											<p className="text-[12px] text-setu-600 font-medium transition-colors duration-300 group-hover:text-setu-500">
												{role}
											</p>
										</div>
									</div>
								</motion.div>
							</StaggerItem>
						))}
					</StaggerList>
				</div>
			</section>

			{/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
			<section className="py-32 px-4 text-center bg-setu-950 relative overflow-hidden">
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						background:
							"radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,160,91,0.14) 0%, transparent 70%)",
					}}
				/>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-setu-800/40 rounded-full pointer-events-none" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-setu-800/50 rounded-full pointer-events-none" />

				<div className="relative max-w-7xl mx-auto">
					<RevealFade>
						<p className="flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-400 mb-6">
							<div className="w-6 h-[2px] bg-setu-500 rounded" />
							Join the Movement
							<div className="w-6 h-[2px] bg-setu-500 rounded" />
						</p>
					</RevealFade>

					<Reveal delay={0.1}>
						<h2
							className="text-[clamp(38px,5.5vw,64px)] font-bold text-white leading-[1.07] tracking-[-1px] mb-5"
							style={{ fontFamily: "var(--font-display)" }}>
							Ready to make a<br />
							<em className="italic text-setu-400">real difference?</em>
						</h2>
					</Reveal>

					<Reveal delay={0.2}>
						<p className="text-[17px] text-white/45 max-w-[460px] mx-auto mb-12 leading-[1.75]">
							Start your fundraiser in minutes. No hidden fees. Every donation
							goes directly to verified causes across Nepal.
						</p>
					</Reveal>

					<Reveal delay={0.28}>
						<div className="flex items-center justify-center gap-4 flex-wrap">
							<motion.div
								whileHover={shouldReduce ? {} : { y: -3, scale: 1.02 }}
								whileTap={shouldReduce ? {} : { scale: 0.98 }}
								transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}>
								<Link
									href="/register"
									className="inline-flex items-center gap-2 px-10 py-5 bg-setu-500 hover:bg-setu-400 text-white text-[15px] font-bold rounded-full no-underline transition-colors duration-200 shadow-[0_8px_28px_rgba(34,160,91,0.4)] hover:shadow-[0_12px_36px_rgba(34,160,91,0.5)]">
									Start Your Fundraiser <ArrowRight className="w-4 h-4" />
								</Link>
							</motion.div>
							<motion.div
								whileHover={shouldReduce ? {} : { y: -2 }}
								transition={{ duration: 0.2 }}>
								<Link
									href="/campaigns"
									className="inline-flex items-center gap-2 px-9 py-5 bg-white/[0.07] border border-white/15 hover:bg-white/[0.12] text-white/80 hover:text-white text-[15px] font-semibold rounded-full no-underline transition-all duration-200">
									Browse Campaigns
								</Link>
							</motion.div>
						</div>
					</Reveal>

					<RevealFade delay={0.36}>
						<div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
							{[
								{ icon: ShieldCheck, label: "Secure & Encrypted" },
								{ icon: Clock, label: "Setup in 2 minutes" },
								{ icon: Heart, label: "Free forever" },
							].map(({ icon: Icon, label }) => (
								<div
									key={label}
									className="flex items-center gap-2 text-[13px] text-white/35 font-medium">
									<Icon className="w-4 h-4 text-setu-500" />
									{label}
								</div>
							))}
						</div>
					</RevealFade>
				</div>
			</section>
		</div>
	);
}
