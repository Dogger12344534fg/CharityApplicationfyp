"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  Target,
  Heart,
  Share2,
  Flag,
  AlertTriangle,
  Calendar,
  TrendingUp,
  ShieldCheck,
  Check,
  ChevronRight,
  Zap,
  Facebook,
  Twitter,
  Link2,
} from "lucide-react";
import { useGetCampaignById } from "@/src/hooks/useCampaign";

const REACTIONS = [
  { emoji: "❤️", label: "Love", key: "love" },
  { emoji: "💪", label: "Support", key: "support" },
  { emoji: "😢", label: "Sad", key: "sad" },
  { emoji: "🙏", label: "Grateful", key: "grateful" },
  { emoji: "🔥", label: "Urgent", key: "urgent" },
];

type ReactionKey = "love" | "support" | "sad" | "grateful" | "urgent";
type ReactionCounts = Record<ReactionKey, number>;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-NP", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const fmtNPR = (n: number) =>
  n >= 100000 ? `NPR ${(n / 100000).toFixed(1)}L` : `NPR ${n.toLocaleString()}`;

const daysLeft = (end?: string) => {
  if (!end) return null;
  return Math.max(
    0,
    Math.ceil((new Date(end).getTime() - Date.now()) / 86_400_000),
  );
};

const CAT_COLOR: Record<string, { bg: string; text: string; border: string }> =
  {
    Medical: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
    Education: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    "Emergency Relief": {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    Charity: {
      bg: "bg-setu-50",
      text: "text-setu-700",
      border: "border-setu-200",
    },
    Animals: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    Environment: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  };

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  active: {
    label: "Active",
    color: "text-setu-700",
    bg: "bg-setu-50 border-setu-200",
    dot: "bg-setu-500",
  },
  pending: {
    label: "Under Review",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-400",
  },
  completed: {
    label: "Completed",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
  suspended: {
    label: "Suspended",
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
    dot: "bg-gray-400",
  },
};

const MOCK_DONORS = [
  { name: "Sita M.", amount: 2000, time: "2 mins ago", top: true },
  { name: "Ramesh K.", amount: 5000, time: "14 mins ago", top: false },
  { name: "Anonymous", amount: 500, time: "1 hr ago", top: false },
  { name: "Priya S.", amount: 1000, time: "3 hrs ago", top: false },
];

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, isLoading, isError } = useGetCampaignById(id);
  const campaign = data?.data;

  const [reactions, setReactions] = useState<ReactionCounts>({
    love: 24,
    support: 18,
    sad: 9,
    grateful: 31,
    urgent: 14,
  });
  const [myReaction, setMyReaction] = useState<ReactionKey | null>(null);
  const [popKey, setPopKey] = useState<ReactionKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleReaction = (key: ReactionKey) => {
    if (myReaction === key) {
      setReactions((r) => ({ ...r, [key]: r[key] - 1 }));
      setMyReaction(null);
    } else {
      if (myReaction)
        setReactions((r) => ({ ...r, [myReaction]: r[myReaction] - 1 }));
      setReactions((r) => ({ ...r, [key]: r[key] + 1 }));
      setMyReaction(key);
      setPopKey(key);
      setTimeout(() => setPopKey(null), 600);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading)
    return (
      <div
        className="min-h-screen bg-[#f5f5f0] flex items-center justify-center"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full border-4 border-setu-100 border-t-setu-500 animate-spin absolute" />
            <Heart className="absolute inset-0 m-auto w-5 h-5 text-setu-500" />
          </div>
          <p className="text-[14px] text-setu-600/60 font-medium">
            Loading campaign…
          </p>
        </div>
      </div>
    );

  if (isError || !campaign)
    return (
      <div
        className="min-h-screen bg-[#f5f5f0] flex items-center justify-center"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <div className="text-center max-w-sm px-4">
          <div className="w-20 h-20 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2
            className="text-[20px] font-bold text-setu-950 mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Campaign not found
          </h2>
          <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
            This campaign may have been removed or the link is incorrect.
          </p>
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 px-6 py-3 bg-setu-700 text-white font-bold rounded-full text-sm no-underline hover:bg-setu-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Browse Campaigns
          </Link>
        </div>
      </div>
    );

  const pct = Math.min(
    Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
    100,
  );
  const remaining = Math.max(0, campaign.goalAmount - campaign.raisedAmount);
  const left = campaign.endDate ? daysLeft(campaign.endDate) : null;
  const status = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.pending;
  const catColor =
    CAT_COLOR[campaign.category?.name ?? ""] ?? CAT_COLOR.Charity;
  const desc = campaign.description ?? "";
  const shortDesc = desc.length > 300 ? desc.slice(0, 300) + "…" : desc;

  return (
    <div
      className="bg-[#f5f5f0] min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-[13px]">
          <Link
            href="/campaigns"
            className="flex items-center gap-1.5 text-setu-600 font-semibold no-underline hover:text-setu-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Campaigns
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500 truncate max-w-[300px]">
            {campaign.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="space-y-5">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {campaign.category?.name && (
                  <span
                    className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}
                  >
                    {campaign.category.name}
                  </span>
                )}
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full border ${status.bg} ${status.color}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${status.dot} ${campaign.status === "active" ? "animate-pulse" : ""}`}
                  />
                  {status.label}
                </span>
                {campaign.urgent && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white text-[11px] font-bold rounded-full">
                    <Zap className="w-3 h-3" /> Urgent
                  </span>
                )}
              </div>
              <h1
                className="text-[clamp(22px,2.8vw,36px)] font-bold text-setu-950 leading-tight tracking-[-0.5px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {campaign.title}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                {campaign.location?.name && (
                  <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-setu-400" />{" "}
                    {campaign.location.name}
                  </span>
                )}
                {campaign.createdBy?.name && (
                  <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                    <Users className="w-3.5 h-3.5 text-setu-400" /> Organized by{" "}
                    <strong className="text-setu-800 ml-1">
                      {campaign.createdBy.name}
                    </strong>
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-setu-100 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
              {campaign.images?.url ? (
                <img
                  src={campaign.images.url}
                  alt={campaign.title}
                  className="w-full object-cover"
                  style={{ aspectRatio: "16/9", maxHeight: "520px" }}
                />
              ) : (
                <div
                  className="w-full bg-gradient-to-br from-setu-800 to-setu-950"
                  style={{ aspectRatio: "16/9", maxHeight: "520px" }}
                />
              )}
            </div>

            <div className="lg:hidden">
              <DonateCard
                campaign={campaign}
                pct={pct}
                remaining={remaining}
                left={left}
                campaignId={id}
              />
            </div>

            <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-setu-700 to-setu-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-[16px] font-black">
                    {campaign.createdBy?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-setu-950">
                    {campaign.createdBy?.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-setu-500" />
                    <span className="text-[11px] font-semibold text-setu-600">
                      Verified Organizer
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-400">Campaign started</p>
                <p className="text-[12px] font-semibold text-setu-800">
                  {fmtDate(campaign.startDate)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 sm:px-7 pt-6 pb-5 border-b border-gray-50">
                <h2
                  className="text-[17px] font-bold text-setu-950"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  About this Campaign
                </h2>
              </div>
              <div className="px-6 sm:px-7 py-6">
                <div className="space-y-4">
                  {(expanded ? desc : shortDesc).split("\n").map((para, i) =>
                    para.trim() ? (
                      <p
                        key={i}
                        className="text-[15px] text-gray-600 leading-[1.85]"
                      >
                        {para}
                      </p>
                    ) : (
                      <br key={i} />
                    ),
                  )}
                </div>
                {desc.length > 300 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-4 text-[13px] font-bold text-setu-600 hover:text-setu-500 transition-colors cursor-pointer border-none bg-transparent flex items-center gap-1"
                  >
                    {expanded ? "Show less" : "Read more"}
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`}
                    />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <p className="text-[14px] font-bold text-setu-800">
                  How does this make you feel?
                </p>
                <span className="text-[11px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full font-medium">
                  {Object.values(reactions).reduce((a, b) => a + b, 0)}{" "}
                  reactions
                </span>
              </div>
              <div className="p-5 flex flex-wrap gap-2.5">
                {REACTIONS.map(({ emoji, label, key }) => {
                  const isActive = myReaction === key;
                  const isPop = popKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleReaction(key as ReactionKey)}
                      className={[
                        "flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-[13px] font-semibold transition-all duration-200 cursor-pointer select-none",
                        isActive
                          ? "bg-setu-50 border-setu-400 text-setu-800 shadow-[0_2px_10px_rgba(21,104,57,0.15)]"
                          : "bg-white border-gray-200 text-gray-700 hover:border-setu-200 hover:bg-setu-50/50",
                        isPop ? "scale-110" : "scale-100",
                      ].join(" ")}
                    >
                      <span
                        className={`text-[20px] leading-none transition-transform duration-200 ${isPop ? "scale-125" : ""}`}
                      >
                        {emoji}
                      </span>
                      <span className="hidden sm:inline text-[13px]">
                        {label}
                      </span>
                      <span
                        className={`text-[12px] font-bold tabular-nums ${isActive ? "text-setu-600" : "text-gray-400"}`}
                      >
                        {reactions[key as ReactionKey]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2
                  className="text-[17px] font-bold text-setu-950"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Fundraising Progress
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-3 mb-4">
                  <span
                    className="text-[38px] font-black text-setu-950 leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {fmtNPR(campaign.raisedAmount)}
                  </span>
                  <span className="text-[14px] text-gray-400 mb-1.5">
                    raised of{" "}
                    <span className="font-bold text-setu-700">
                      {fmtNPR(campaign.goalAmount)}
                    </span>
                  </span>
                </div>

                <div className="h-5 bg-gray-100 rounded-full overflow-hidden mb-2 relative">
                  <div
                    className="h-full bg-gradient-to-r from-setu-700 via-setu-500 to-setu-400 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(pct, 3)}%` }}
                  >
                    {pct > 8 && (
                      <span className="text-[10px] font-black text-white leading-none">
                        {pct}%
                      </span>
                    )}
                  </div>
                </div>
                {pct <= 8 && (
                  <p className="text-[12px] font-bold text-setu-700 mb-3">
                    {pct}% funded
                  </p>
                )}

                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    {
                      label: "Funded",
                      value: `${pct}%`,
                      color: "text-setu-700",
                    },
                    {
                      label: "Donors",
                      value: campaign.donorsCount.toLocaleString(),
                      color: "text-setu-950",
                    },
                    {
                      label: "Days Left",
                      value: left !== null ? `${left}` : "—",
                      color: left === 0 ? "text-red-500" : "text-setu-950",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100"
                    >
                      <p
                        className={`text-[24px] font-black leading-none ${color}`}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {value}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium mt-1.5">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                {remaining > 0 && (
                  <div className="mt-4 p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-center">
                    <p className="text-[12px] text-amber-700 font-semibold">
                      {fmtNPR(remaining)} still needed to reach the goal
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2
                  className="text-[17px] font-bold text-setu-950"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Recent Donors
                </h2>
                <span className="text-[12px] font-semibold text-setu-600">
                  {campaign.donorsCount.toLocaleString()} total
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {MOCK_DONORS.map((donor, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-setu-600 to-setu-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[13px] font-bold">
                        {donor.name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-semibold text-setu-900">
                          {donor.name}
                        </p>
                        {donor.top && (
                          <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-full">
                            Top donor
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-gray-400">{donor.time}</p>
                    </div>
                    <p className="text-[14px] font-bold text-setu-800 flex-shrink-0">
                      {fmtNPR(donor.amount)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-50">
                <button className="text-[13px] font-bold text-setu-600 hover:text-setu-500 transition-colors cursor-pointer border-none bg-transparent">
                  See all donors →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] p-6">
              <h2
                className="text-[17px] font-bold text-setu-950 mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Sharing helps more than you think
              </h2>
              <p className="text-[13px] text-gray-500 mb-5 leading-relaxed">
                On average, each share can inspire additional donations to this
                campaign. Help spread the word.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white text-[13px] font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none">
                  <Facebook className="w-4 h-4" /> Facebook
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1DA1F2] text-white text-[13px] font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none">
                  <Twitter className="w-4 h-4" /> Twitter
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-bold rounded-xl transition-colors cursor-pointer border-none"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-setu-500" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2
                  className="text-[17px] font-bold text-setu-950"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Campaign Details
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  {
                    label: "Category",
                    value: campaign.category?.name,
                    icon: Target,
                  },
                  {
                    label: "Location",
                    value: campaign.location?.name,
                    icon: MapPin,
                  },
                  {
                    label: "Started",
                    value: fmtDate(campaign.startDate),
                    icon: Calendar,
                  },
                  {
                    label: "Deadline",
                    value: campaign.endDate
                      ? fmtDate(campaign.endDate)
                      : "No deadline",
                    icon: Clock,
                  },
                  {
                    label: "Goal",
                    value: fmtNPR(campaign.goalAmount),
                    icon: Target,
                  },
                  {
                    label: "Raised",
                    value: fmtNPR(campaign.raisedAmount),
                    icon: TrendingUp,
                  },
                  {
                    label: "Donors",
                    value: `${campaign.donorsCount.toLocaleString()} people`,
                    icon: Heart,
                  },
                ]
                  .filter((r) => r.value)
                  .map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-4 px-6 py-3.5"
                    >
                      <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-setu-500" />
                      </div>
                      <span className="text-[13px] text-gray-400 font-medium w-24 flex-shrink-0">
                        {label}
                      </span>
                      <span className="text-[13px] font-semibold text-setu-900">
                        {value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {campaign.status === "rejected" && campaign.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-bold text-red-800 mb-1">
                    Campaign Rejected
                  </p>
                  <p className="text-[13px] text-red-700 leading-relaxed">
                    {campaign.rejectionReason}
                  </p>
                </div>
              </div>
            )}
            {campaign.status === "suspended" && campaign.suspendedReason && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-bold text-amber-800 mb-1">
                    Campaign Suspended
                  </p>
                  <p className="text-[13px] text-amber-700 leading-relaxed">
                    {campaign.suspendedReason}
                  </p>
                </div>
              </div>
            )}

            <Link
              href="/campaigns"
              className="flex items-center justify-between p-5 bg-setu-50 border border-setu-100 rounded-2xl no-underline hover:bg-setu-100 transition-colors group"
            >
              <div>
                <p className="text-[14px] font-bold text-setu-800">
                  Browse more campaigns
                </p>
                <p className="text-[12px] text-setu-600/60 mt-0.5">
                  Discover other causes making a difference
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-setu-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <DonateCard
                campaign={campaign}
                pct={pct}
                remaining={remaining}
                left={left}
                campaignId={id}
              />

              {campaign.approvedBy && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
                  <div className="w-9 h-9 bg-setu-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-setu-800">
                      Verified Campaign
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                      Reviewed by Setu
                      {campaign.approvedAt
                        ? ` on ${fmtDate(campaign.approvedAt)}`
                        : ""}
                      .
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
                <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Share this campaign
                </p>
                <div className="flex flex-col gap-2">
                  <button className="flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] text-white text-[13px] font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none w-full">
                    <Facebook className="w-4 h-4" /> Share on Facebook
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2.5 bg-[#1DA1F2] text-white text-[13px] font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none w-full">
                    <Twitter className="w-4 h-4" /> Share on Twitter
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-semibold rounded-xl transition-colors cursor-pointer border-none w-full"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-setu-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4" /> Copy link
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)] space-y-3">
                {[
                  { icon: ShieldCheck, text: "100% verified by Setu team" },
                  { icon: Heart, text: "95% of funds go to the cause" },
                  { icon: Users, text: "Full donor transparency" },
                  { icon: Flag, text: "Report if something's wrong" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2.5 text-[12px] text-gray-500"
                  >
                    <Icon className="w-3.5 h-3.5 text-setu-400 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 leading-none font-medium uppercase tracking-wide">
              Raised
            </p>
            <p className="text-[16px] font-black text-setu-800 leading-tight">
              {fmtNPR(campaign.raisedAmount)}
            </p>
          </div>
          <Link
            href={`/campaigns/${id}/donate`}
            className="flex-[2] py-3.5 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-xl text-[15px] text-center transition-colors no-underline shadow-[0_4px_14px_rgba(21,104,57,0.35)]"
          >
            Donate Now
          </Link>
          <button
            onClick={handleCopy}
            className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 cursor-pointer flex-shrink-0 hover:bg-gray-200 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-setu-500" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <div className="lg:hidden h-24" />
    </div>
  );
}

function DonateCard({
  campaign,
  pct,
  remaining,
  left,
  campaignId,
}: {
  campaign: any;
  pct: number;
  remaining: number;
  left: number | null;
  campaignId: string;
}) {
  const QUICK = [500, 1000, 2500, 5000];
  const [sel, setSel] = useState<number | null>(null);
  const [custom, setCustom] = useState("");

  const displayAmt = sel
    ? `NPR ${sel.toLocaleString()}`
    : custom
      ? `NPR ${parseInt(custom || "0").toLocaleString()}`
      : "";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="p-6">
        <p
          className="text-[32px] font-black text-setu-950 leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          NPR {campaign.raisedAmount.toLocaleString()}
        </p>
        <p className="text-[13px] text-gray-400 mt-1.5 mb-4">
          raised of{" "}
          <span className="font-bold text-setu-700">
            NPR {campaign.goalAmount.toLocaleString()}
          </span>{" "}
          goal
        </p>

        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-setu-700 to-setu-400 rounded-full"
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        </div>
        <div className="flex justify-between text-[12px] text-gray-500 mb-5">
          <span className="font-black text-setu-700">{pct}% funded</span>
          <div className="flex gap-3">
            <span>{campaign.donorsCount} donors</span>
            {left !== null && <span>· {left}d left</span>}
          </div>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2">
          Choose amount
        </p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {QUICK.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setSel(amt);
                setCustom("");
              }}
              className={[
                "py-2.5 rounded-xl text-[12px] font-bold border-2 transition-all cursor-pointer",
                sel === amt
                  ? "bg-setu-700 text-white border-setu-700 shadow-[0_2px_8px_rgba(21,104,57,0.3)]"
                  : "bg-white text-setu-700 border-gray-200 hover:border-setu-300 hover:bg-setu-50",
              ].join(" ")}
            >
              {amt >= 1000 ? `${amt / 1000}K` : amt}
            </button>
          ))}
        </div>

        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400 pointer-events-none">
            NPR
          </span>
          <input
            type="number"
            placeholder="Custom amount"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setSel(null);
            }}
            className="w-full pl-14 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-[13px] text-setu-900 focus:outline-none focus:border-setu-400 focus:bg-white transition-all placeholder:text-gray-300"
          />
        </div>

        <Link
          href={`/campaigns/${campaignId}/donate`}
          className="w-full py-4 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-xl text-[15px] transition-all shadow-[0_4px_14px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 no-underline flex items-center justify-center"
        >
          {displayAmt ? `Donate ${displayAmt}` : "Donate Now"}
        </Link>

        {remaining > 0 && (
          <p className="text-[11px] text-center text-amber-600 font-semibold mt-3">
            {fmtNPR(remaining)} still needed
          </p>
        )}

        <p className="text-[11px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-setu-400" />
          Secure · Verified by Setu
        </p>
      </div>
    </div>
  );
}
