"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Megaphone,
  Plus,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ArrowRight,
  Loader2,
  AlertCircle,
  PauseCircle,
  Shield,
  Calendar,
  X,
  Check,
} from "lucide-react";
import { useGetMyCampaigns, useUpdateCampaign } from "@/src/hooks/useCampaign";
import type { Campaign as ApiCampaign } from "@/src/hooks/useCampaign";
import { useGetMyTeams } from "@/src/hooks/useTeam";
import type { Team as ApiTeam } from "@/src/hooks/useTeam";

// ── All possible backend statuses ─────────────────────────────
type Status = "active" | "completed" | "pending" | "rejected" | "suspended";

// ── Map API campaign → local display shape ────────────────────
interface DisplayTeam {
  id: string;
  name: string;
  cat: string;
  catColor: string;
  location: string;
  raised: number;
  goal: number;
  members: number;
  status: Status;
  img: string;
  createdAt: string;
}

interface DisplayCampaign {
  id: string;
  title: string;
  cat: string;
  catColor: string;
  location: string;
  raised: number;
  goal: number;
  donors: number;
  status: Status;
  daysLeft: number;
  endDate: string | null;
  img: string;
  createdAt: string;
}

const CAT_COLORS: Record<string, string> = {
  "Emergency Relief": "bg-orange-100 text-orange-700",
  Medical: "bg-red-100 text-red-700",
  Education: "bg-blue-100 text-blue-700",
  Charity: "bg-setu-100 text-setu-700",
  Animals: "bg-purple-100 text-purple-700",
  Environment: "bg-emerald-100 text-emerald-700",
};

const transformCampaign = (c: ApiCampaign): DisplayCampaign => {
  const endDate = c.endDate ? new Date(c.endDate) : null;
  const daysLeft = endDate
    ? Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / 86_400_000))
    : 0;

  return {
    id: c._id,
    title: c.title,
    cat: c.category?.name ?? "General",
    catColor: CAT_COLORS[c.category?.name ?? ""] ?? "bg-gray-100 text-gray-700",
    location: c.location?.name ?? "Nepal",
    raised: c.raisedAmount,
    goal: c.goalAmount,
    donors: c.donorsCount,
    status: c.status as Status,
    daysLeft,
    endDate: c.endDate ? c.endDate.split("T")[0] : null,
    img: c.images?.url ?? "",
    createdAt: new Date(c.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
};

const transformTeam = (t: ApiTeam): DisplayTeam => {
  return {
    id: t._id,
    name: t.name,
    cat: t.category ?? "General",
    catColor: CAT_COLORS[t.category ?? ""] ?? "bg-gray-100 text-gray-700",
    location: t.location ?? "Nepal",
    raised: t.raisedAmount,
    goal: t.goalAmount,
    members: t.members?.length ?? 0,
    status: t.status as Status,
    img: t.avatar?.url ?? "",
    createdAt: new Date(t.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
};

// ── Status config covering all 5 backend statuses ─────────────
const statusConfig: Record<
  Status,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  active: {
    label: "Active",
    icon: TrendingUp,
    color: "text-setu-700",
    bg: "bg-setu-50 border-setu-200",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  pending: {
    label: "Under Review",
    icon: Clock,
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
  },
  suspended: {
    label: "Suspended",
    icon: PauseCircle,
    color: "text-gray-700",
    bg: "bg-gray-50 border-gray-200",
  },
};

const tabs: { key: Status | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Under Review" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
  { key: "suspended", label: "Suspended" },
];

export default function MyCampaignsPage() {
  const [viewType, setViewType] = useState<"campaigns" | "teams">("campaigns");
  const [activeTab, setActiveTab] = useState<Status | "all">("all");
  const [editingDateFor, setEditingDateFor] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const updateCampaign = useUpdateCampaign();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "teams") {
      setViewType("teams");
    }
  }, []);

  // ── Fetch from API ─────────────────────────────────────────────
  const { data: campaignData, isLoading: isLoadingCampaigns, isError: isErrorCampaigns } = useGetMyCampaigns({
    limit: 50, // fetch all in one go for client-side tab filtering
  });

  const { data: teamData, isLoading: isLoadingTeams, isError: isErrorTeams } = useGetMyTeams({
    limit: 50,
  });

  const allCampaigns: DisplayCampaign[] = (campaignData?.campaigns ?? []).map(transformCampaign);
  const allTeams: DisplayTeam[] = (teamData?.teams ?? []).map(transformTeam);

  const isLoading = viewType === "campaigns" ? isLoadingCampaigns : isLoadingTeams;
  const isError = viewType === "campaigns" ? isErrorCampaigns : isErrorTeams;

  const filteredCampaigns = activeTab === "all" ? allCampaigns : allCampaigns.filter((c) => c.status === activeTab);
  const filteredTeams = activeTab === "all" ? allTeams : allTeams.filter((t) => t.status === activeTab);

  const fmt = (n: number) =>
    n >= 100000
      ? `NPR ${(n / 100000).toFixed(1)}L`
      : `NPR ${n.toLocaleString()}`;

  return (
    <div
      className="min-h-screen bg-cream py-12 px-4"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-2">
              <div className="w-5 h-[2px] bg-setu-500 rounded" />
              Account
            </div>
            <h1
              className="text-[clamp(28px,4vw,38px)] font-bold text-setu-950 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              My Hub
            </h1>
          </div>
          <Link
            href={viewType === "campaigns" ? "/campaigns/create" : "/teams/create"}
            className="flex items-center gap-2 px-5 py-3 bg-setu-700 hover:bg-setu-600 text-white text-[13px] font-bold rounded-full no-underline transition-all duration-200 shadow-[0_4px_12px_rgba(21,104,57,0.3)] flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> New {viewType === "campaigns" ? "Campaign" : "Team"}
          </Link>
        </div>

        {/* View Toggle */}
        <div className="flex p-1 bg-white border border-setu-100 rounded-full w-fit mb-8 shadow-sm">
          <button
            onClick={() => { setViewType("campaigns"); setActiveTab("all"); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 ${viewType === "campaigns" ? "bg-setu-50 text-setu-800" : "text-gray-500 hover:text-setu-600 hover:bg-setu-50/50"}`}
          >
            <Megaphone className="w-4 h-4" /> Campaigns
          </button>
          <button
            onClick={() => { setViewType("teams"); setActiveTab("all"); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 ${viewType === "teams" ? "bg-setu-50 text-setu-800" : "text-gray-500 hover:text-setu-600 hover:bg-setu-50/50"}`}
          >
            <Shield className="w-4 h-4" /> Teams
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-setu-500" />
            <p className="text-[14px] text-setu-600/60 font-medium">
              Loading your campaigns…
            </p>
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="bg-white rounded-3xl border border-red-100 p-12 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <p className="text-[16px] font-bold text-setu-900 mb-1">
              Failed to load campaigns
            </p>
            <p className="text-[13px] text-gray-500">
              Please refresh the page and try again.
            </p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                {
                  label: "Total Campaigns",
                  value: allCampaigns.length,
                  color: "text-setu-700",
                },
                {
                  label: "Active",
                  value: allCampaigns.filter((c) => c.status === "active")
                    .length,
                  color: "text-setu-600",
                },
                {
                  label: "Total Raised",
                  value: fmt(allCampaigns.reduce((s, c) => s + c.raised, 0)),
                  color: "text-setu-700",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-setu-100 p-5 shadow-[0_2px_8px_rgba(21,104,57,0.05)]"
                >
                  <p
                    className={`text-[22px] font-bold ${color}`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {value}
                  </p>
                  <p className="text-[12px] text-gray-500 font-medium mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={[
                    "px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150 cursor-pointer",
                    activeTab === key
                      ? "bg-setu-700 text-white border-setu-700 shadow-[0_2px_8px_rgba(21,104,57,0.25)]"
                      : "bg-white text-setu-700 border-setu-200 hover:border-setu-400 hover:bg-setu-50",
                  ].join(" ")}
                >
                  {label}
                  {/* Badge count */}
                  {key !== "all" && (
                    <span
                      className={[
                        "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                        activeTab === key
                          ? "bg-white/25 text-white"
                          : "bg-setu-100 text-setu-600",
                      ].join(" ")}
                    >
                      {allCampaigns.filter((c) => c.status === key).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* List */}
            {(viewType === "campaigns" ? filteredCampaigns : filteredTeams).length === 0 ? (
              <div className="bg-white rounded-3xl border border-setu-100 p-16 text-center">
                {viewType === "campaigns" ? (
                  <Megaphone className="w-10 h-10 text-setu-300 mx-auto mb-4" />
                ) : (
                  <Shield className="w-10 h-10 text-setu-300 mx-auto mb-4" />
                )}
                <p className="text-[16px] font-bold text-setu-900 mb-1">
                  {activeTab === "all"
                    ? `No ${viewType} yet`
                    : `No ${activeTab} ${viewType}`}
                </p>
                <p className="text-[13px] text-gray-500 mb-6">
                  {activeTab === "all"
                    ? `Start your first ${viewType === "campaigns" ? "campaign" : "team"} and make a difference.`
                    : `You don't have any ${viewType} with this status.`}
                </p>
                {activeTab === "all" && (
                  <Link
                    href={viewType === "campaigns" ? "/campaigns/create" : "/teams/create"}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-setu-700 text-white text-sm font-bold rounded-full no-underline hover:bg-setu-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Create {viewType === "campaigns" ? "Campaign" : "Team"}
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {(viewType === "campaigns" ? filteredCampaigns : filteredTeams).map((item: any) => {
                  const pct = Math.min(Math.round((item.raised / item.goal) * 100), 100);
                  const S = statusConfig[item.status as Status] || statusConfig.pending;
                  const StatusIcon = S.icon;
                  const isCampaign = viewType === "campaigns";
                  
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] overflow-hidden hover:shadow-[0_6px_24px_rgba(21,104,57,0.1)] hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="flex gap-0">
                        {/* Image */}
                        <div className="w-36 flex-shrink-0 hidden sm:block">
                          {item.img ? (
                            <img
                              src={item.img}
                              alt={item.title || item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-setu-50 flex items-center justify-center">
                              <Users className="w-8 h-8 text-setu-300" />
                            </div>
                          )}
                        </div>
                        {/* Content */}
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${item.catColor}`}
                                >
                                  {item.cat}
                                </span>
                                <span
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${S.bg} ${S.color}`}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  {S.label}
                                </span>
                              </div>
                              <h3 className="text-[15px] font-bold text-setu-950 leading-snug">
                                {isCampaign ? item.title : item.name}
                              </h3>
                            </div>
                            <Link
                              href={isCampaign ? `/campaigns/${item.id}` : `/teams/${item.id}`}
                              className="flex-shrink-0 flex items-center gap-1 text-[12px] font-semibold text-setu-600 hover:text-setu-500 no-underline transition-colors"
                            >
                              View <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          <div className="flex items-center gap-4 text-[12px] text-gray-500 mb-3 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {item.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {isCampaign ? `${item.donors.toLocaleString()} donors` : `${item.members.toLocaleString()} members`}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {item.createdAt}
                            </span>
                            {isCampaign && (item.status === "active" || item.status === "completed") && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-setu-500" />
                                {item.daysLeft > 0
                                  ? `${item.daysLeft}d left`
                                  : item.endDate
                                  ? "Ended"
                                  : "No end date"}
                                <button
                                  onClick={() => {
                                    setEditingDateFor(item.id);
                                    setEditDate(item.endDate ?? "");
                                  }}
                                  className="ml-1 text-setu-500 hover:text-setu-700 underline text-[11px] font-semibold cursor-pointer"
                                >
                                  Edit
                                </button>
                              </span>
                            )}
                          </div>

                          {/* Inline end-date editor */}
                          {isCampaign && editingDateFor === item.id && (
                            <div className="flex items-center gap-2 mb-3 p-2.5 bg-setu-50 border border-setu-200 rounded-xl">
                              <Calendar className="w-4 h-4 text-setu-600 flex-shrink-0" />
                              <input
                                type="date"
                                value={editDate}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setEditDate(e.target.value)}
                                className="flex-1 text-[13px] text-setu-900 bg-transparent border-none outline-none font-medium"
                              />
                              <button
                                disabled={!editDate || updateCampaign.isPending}
                                onClick={() => {
                                  if (!editDate) return;
                                  updateCampaign.mutate(
                                    { id: item.id, endDate: editDate },
                                    {
                                      onSuccess: () => setEditingDateFor(null),
                                    }
                                  );
                                }}
                                className="flex items-center justify-center w-7 h-7 rounded-full bg-setu-700 text-white hover:bg-setu-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                {updateCampaign.isPending && editingDateFor === item.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => setEditingDateFor(null)}
                                className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Progress */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-setu-700 to-setu-400 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[12px] font-bold text-setu-700 flex-shrink-0">
                              {pct}%
                            </span>
                            <span className="text-[12px] text-gray-500 flex-shrink-0">
                              {fmt(item.raised)} / {fmt(item.goal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTA */}
            {(viewType === "campaigns" ? allCampaigns : allTeams).length > 0 && (
              <div className="mt-10 bg-setu-900 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p
                    className="text-white font-bold text-[17px]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Ready to start another {viewType === "campaigns" ? "campaign" : "team"}?
                  </p>
                  <p className="text-setu-300 text-sm mt-1">
                    {viewType === "campaigns" 
                      ? "Every campaign brings Nepal closer together."
                      : "Form a collective and multiply your impact."}
                  </p>
                </div>
                <Link
                  href={viewType === "campaigns" ? "/campaigns/create" : "/teams/create"}
                  className="flex items-center gap-2 px-7 py-3.5 bg-setu-500 hover:bg-setu-400 text-white text-sm font-bold rounded-full no-underline transition-all duration-200 flex-shrink-0"
                >
                  Start a {viewType === "campaigns" ? "Campaign" : "Team"} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
