"use client";

import Link from "next/link";
import {
  Heart,
  Users,
  Globe,
  TrendingUp,
  Shield,
  ArrowRight,
  MapPin,
  Star,
  ChevronRight,
  Zap,
  Eye,
  Package,
} from "lucide-react";
import { usePublicStats, formatNPR, formatCount } from "@/src/hooks/usePublicStats";

const founder = {
  name: "Dipendra Roka",
  role: "Founder & CEO",
  img: "/images/dipendra.png",
};

const milestones = [
  {
    year: "2022",
    title: "Setu Founded",
    desc: "Started with a vision to unify Nepal's fragmented donation ecosystem.",
  },
  {
    year: "2023",
    title: "First 100 Campaigns",
    desc: "Reached 100 verified campaigns across medical, education, and emergency relief.",
  },
  {
    year: "2023",
    title: "NPR 50L Raised",
    desc: "Crossed NPR 50 Lakh in total donations within our first year of operation.",
  },
  {
    year: "2024",
    title: "Goods Donation Launch",
    desc: "Launched physical goods donation for disaster relief — a first in Nepal.",
  },
  {
    year: "2024",
    title: "18,400+ Donors",
    desc: "Reached 18,400 active donors supporting causes across all 77 districts.",
  },
  {
    year: "2025",
    title: "NPR 2.4Cr+ Raised",
    desc: "Crossed NPR 2.4 Crore raised — Nepal's largest unified giving platform.",
  },
];

const values = [
  {
    icon: Shield,
    title: "Transparency",
    desc: "Every rupee is tracked and reported. Donors always know exactly how their contribution is being used.",
    color: "text-setu-600",
    bg: "bg-setu-50",
  },
  {
    icon: Heart,
    title: "Compassion",
    desc: "We put people first — whether it's a flood victim, a cancer patient, or a child who needs a school.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Zap,
    title: "Speed",
    desc: "In emergencies, minutes matter. Our express disbursement system gets funds to verified campaigns within 24 hours.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Globe,
    title: "Inclusivity",
    desc: "We serve all 77 districts of Nepal, from Humla to Jhapa, ensuring no community is left behind.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

function AboutIllustration() {
  return (
    <svg
      viewBox="0 0 380 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      aria-hidden="true"
    >
      {/* Subtle dark blob background */}
      <ellipse cx="190" cy="148" rx="168" ry="118" fill="#0f2e1a" opacity="0.6" />

      {/* ── Bridge structure ── */}
      {/* Road / base */}
      <rect x="50" y="178" width="280" height="12" rx="4" fill="#1a8048" />
      {/* Left tower */}
      <rect x="98" y="100" width="14" height="90" rx="3" fill="#22c55e" />
      {/* Right tower */}
      <rect x="268" y="100" width="14" height="90" rx="3" fill="#22c55e" />
      {/* Left tower cap */}
      <rect x="92" y="94" width="26" height="10" rx="3" fill="#4ade80" />
      {/* Right tower cap */}
      <rect x="262" y="94" width="26" height="10" rx="3" fill="#4ade80" />

      {/* Main cable — left arc */}
      <path
        d="M105 94 Q148 148 190 162 Q232 148 275 94"
        stroke="#4ade80"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Suspender cables */}
      {[130, 152, 172, 190, 208, 228, 250].map((x, i) => {
        // y on the cable curve (approximate parabola)
        const t = (x - 105) / 170;
        const cy = 94 + 68 * (1 - Math.pow(2 * t - 1, 2));
        return (
          <line
            key={x}
            x1={x}
            y1={cy}
            x2={x}
            y2={178}
            stroke="#86efac"
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}

      
      {/* Heart above donor */}
      <path
        d="M42 134 Q40 130 36 130 Q32 130 32 135 Q32 140 42 146 Q52 140 52 135 Q52 130 48 130 Q44 130 42 134 Z"
        fill="#4ade80"
        opacity="0.85"
      />
      {/* Donor label */}
      <rect x="22" y="186" width="48" height="16" rx="8" fill="#156839" />
      <text x="46" y="198" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="sans-serif">DONOR</text>

      {/* ── Right side: beneficiary figure ── */}
      <circle cx="334" cy="148" r="10" fill="#156839" />
      <path d="M324 178 Q334 160 344 178" fill="#156839" />
      {/* Star / sparkle above beneficiary */}
      <path
        d="M334 128 L336 134 L342 134 L337 138 L339 144 L334 140 L329 144 L331 138 L326 134 L332 134 Z"
        fill="#4ade80"
        opacity="0.85"
      />
      {/* Beneficiary label */}
      <rect x="302" y="186" width="64" height="16" rx="8" fill="#156839" />
      <text x="334" y="198" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="sans-serif">BENEFICIARY</text>

      {/* ── Setu badge in the centre of bridge ── */}
      <rect x="162" y="150" width="56" height="24" rx="12" fill="#22c55e" />
      <text x="190" y="166" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">SETU</text>

      {/* ── Floating stat cards ── */}
      {/* Left card */}
      <rect x="24" y="58" width="68" height="28" rx="8" fill="#0f2e1a" stroke="#22c55e" strokeWidth="1" opacity="0.9" />
      <text x="58" y="70" textAnchor="middle" fill="#4ade80" fontSize="9" fontWeight="800" fontFamily="sans-serif">NPR 2.4Cr</text>
      <text x="58" y="80" textAnchor="middle" fill="#86efac" fontSize="6.5" fontFamily="sans-serif" opacity="0.7">Total Raised</text>

      {/* Right card */}
      <rect x="288" y="58" width="68" height="28" rx="8" fill="#0f2e1a" stroke="#22c55e" strokeWidth="1" opacity="0.9" />
      <text x="322" y="70" textAnchor="middle" fill="#4ade80" fontSize="9" fontWeight="800" fontFamily="sans-serif">18,400+</text>
      <text x="322" y="80" textAnchor="middle" fill="#86efac" fontSize="6.5" fontFamily="sans-serif" opacity="0.7">Donors</text>

      {/* Top centre card */}
      <rect x="152" y="42" width="76" height="28" rx="8" fill="#0f2e1a" stroke="#22c55e" strokeWidth="1" opacity="0.9" />
      <text x="190" y="54" textAnchor="middle" fill="#4ade80" fontSize="9" fontWeight="800" fontFamily="sans-serif">77 Districts</text>
      <text x="190" y="64" textAnchor="middle" fill="#86efac" fontSize="6.5" fontFamily="sans-serif" opacity="0.7">Across Nepal</text>

      {/* Floating accent dots */}
      <circle cx="130" cy="62" r="4" fill="#4ade80" opacity="0.4" />
      <circle cx="252" cy="62" r="4" fill="#4ade80" opacity="0.4" />
      <circle cx="72" cy="112" r="3" fill="#86efac" opacity="0.35" />
      <circle cx="310" cy="112" r="3" fill="#86efac" opacity="0.35" />
      <circle cx="190" cy="228" r="3" fill="#4ade80" opacity="0.3" />

      {/* Bottom pill */}
      <rect x="120" y="218" width="140" height="26" rx="13" fill="#22c55e" opacity="0.15" />
      <rect x="120" y="218" width="140" height="26" rx="13" stroke="#4ade80" strokeWidth="1" opacity="0.3" />
      <text x="190" y="235" textAnchor="middle" fill="#86efac" fontSize="9" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.5">Bridging Nepal's Heart of Giving</text>
    </svg>
  );
}

export default function AboutPage() {
  const { data: statsData } = usePublicStats();
  const ps = statsData?.data;

  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ── HERO ── */}
      <section className="bg-setu-950 py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(34,160,91,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-setu-800/20 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-setu-800/30 rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-400 mb-5">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              Our Story
            </div>
            <h1
              className="text-[clamp(40px,5.5vw,70px)] font-bold text-white leading-[1.04] tracking-[-2px] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Bridging Nepal's
              <br />
              <em className="italic text-setu-400">Heart of Giving.</em>
            </h1>
            <p className="text-[17px] text-white/50 leading-[1.8] max-w-xl mb-10">
              Setu — meaning "bridge" in Nepali — was born from a simple belief:
              that every Nepali deserves access to help when they need it most,
              and every donor deserves to see their impact clearly.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/campaigns"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-setu-500 hover:bg-setu-400 text-white text-[14px] font-bold rounded-full no-underline shadow-[0_6px_20px_rgba(34,160,91,0.35)] hover:-translate-y-0.5 transition-all"
              >
                See Our Impact <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 hover:bg-white/10 text-white text-[14px] font-semibold rounded-full no-underline transition-all"
              >
                How It Works
              </Link>
            </div>
          </div>
          {/* Illustration */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="rounded-2xl border border-white/10 p-4 bg-white/5 backdrop-blur-sm shadow-[0_2px_24px_rgba(0,0,0,0.3)]">
              <AboutIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-setu-900">
        {[
          { icon: TrendingUp, num: ps ? formatNPR(ps.totalRaised) : "...", label: "Total Raised" },
          { icon: Heart, num: ps ? formatCount(ps.completedCampaigns) : "...", label: "Campaigns Funded" },
          { icon: Users, num: ps ? formatCount(ps.totalDonors) : "...", label: "Active Donors" },
          { icon: MapPin, num: "77", label: "Districts Served" },
        ].map(({ icon: Icon, num, label }, i) => (
          <div
            key={label}
            className={`flex items-center gap-4 px-6 lg:px-8 py-8 ${i < 3 ? "border-r border-white/[0.07]" : ""} hover:bg-white/[0.03] transition-colors`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-setu-300" />
            </div>
            <div>
              <p
                className="text-[22px] lg:text-[26px] font-bold text-white leading-none mb-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {num}
              </p>
              <p className="text-[11px] text-white/40 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MISSION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
                <div className="w-6 h-[2px] bg-setu-500 rounded" />
                Mission & Vision
              </div>
              <h2
                className="text-[clamp(30px,4vw,48px)] font-bold text-setu-950 leading-tight tracking-[-0.5px] mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Technology for
                <br />
                <em className="italic text-setu-600">Social Good</em>
              </h2>
              <p className="text-[16px] text-gray-500 leading-[1.8] mb-6">
                Nepal faces recurring disasters, widespread poverty, and limited
                access to healthcare and education. While the spirit of giving
                is strong, the infrastructure to channel it effectively has been
                broken — until now.
              </p>
              <p className="text-[16px] text-gray-500 leading-[1.8] mb-8">
                Setu connects verified campaigns with real donors through a
                transparent, real-time platform. No middlemen. No hidden fees.
                Just direct impact.
              </p>
              <div className="flex gap-4 flex-wrap">
                {[
                  { n: "0%", l: "Hidden fees for donors" },
                  { n: "< 24h", l: "Campaign verification" },
                  { n: "100%", l: "Verified campaigns" },
                ].map(({ n, l }) => (
                  <div
                    key={l}
                    className="bg-setu-50 rounded-2xl border border-setu-100 px-5 py-4 text-center"
                  >
                    <p
                      className="text-[22px] font-bold text-setu-800"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {n}
                    </p>
                    <p className="text-[12px] text-setu-600/60 mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&q=85&auto=format&fit=crop"
                alt="Setu mission"
                className="rounded-3xl w-full h-[440px] object-cover shadow-[0_24px_60px_rgba(21,104,57,0.15)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 bg-setu-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              What We Stand For
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
            </div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-bold text-setu-950 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-7 border border-setu-100 hover:shadow-[0_8px_28px_rgba(21,104,57,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5`}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3
                  className="text-[17px] font-bold text-setu-950 mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h3>
                <p className="text-[13px] text-gray-500 leading-[1.7]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 bg-setu-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              The People
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
            </div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-bold text-setu-950 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Meet the Man behind SETU
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-8 border border-setu-100 hover:shadow-[0_8px_28px_rgba(21,104,57,0.08)] hover:-translate-y-1 transition-all duration-300 w-full max-w-sm text-center">
              <img
                src={founder.img}
                alt={founder.name}
                className="w-24 h-24 rounded-full border-2 border-setu-100 object-cover mx-auto mb-4"
              />
              <p
                className="text-[17px] font-bold text-setu-950 mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {founder.name}
              </p>
              <p className="text-[13px] text-setu-600 font-medium mb-3">
                {founder.role}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 mt-8">
        <section className="py-24 bg-setu-950 relative overflow-hidden rounded-[28px]">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,160,91,0.15) 0%, transparent 70%)",
            }}
          />
          <div className="relative max-w-2xl mx-auto text-center px-6">
            <h2
              className="text-[clamp(32px,4vw,52px)] font-bold text-white leading-[1.07] tracking-[-1px] mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Be Part of the
              <br />
              <em className="italic text-setu-400">Bridge.</em>
            </h2>
            <p className="text-[16px] text-white/45 mb-10 leading-[1.75]">
              Every donation, every campaign, every share builds a stronger Nepal.
            </p>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 px-8 py-4 bg-setu-500 hover:bg-setu-400 text-white text-[15px] font-bold rounded-full no-underline shadow-[0_8px_28px_rgba(34,160,91,0.4)] hover:-translate-y-0.5 transition-all"
            >
              Start Giving Today <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}