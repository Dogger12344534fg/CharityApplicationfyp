"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Check,
  X,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Search,
  Filter,
  Loader2,
  Trophy,
  MapPin,
  Eye,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllTeamsAdmin,
  useApproveTeam,
  useRejectTeam,
  useSuspendTeam,
  useUnsuspendTeam,
} from "@/src/hooks/useTeam";

const fmtNPR = (n: number) =>
  n >= 100000 ? `NPR ${(n / 100000).toFixed(1)}L` : `NPR ${n.toLocaleString()}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-NP", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  active: {
    label: "Active",
    color: "text-setu-700",
    bg: "bg-setu-50",
    border: "border-setu-200",
    dot: "bg-setu-500",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  suspended: {
    label: "Suspended",
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
};

const TABS = ["all", "pending", "active", "rejected", "suspended"] as const;
type Tab = (typeof TABS)[number];

type ModalState =
  | { type: "reject"; teamId: string; teamName: string }
  | { type: "suspend"; teamId: string; teamName: string }
  | null;

export default function AdminTeamsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [reason, setReason] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const queryParams = {
    ...(activeTab !== "all" ? { status: activeTab } : {}),
    ...(search ? { search } : {}),
    sortBy: "createdAt",
    order: "desc",
    limit: 20,
  };

  const { data, isLoading, refetch } = useGetAllTeamsAdmin(queryParams);
  const { mutate: approveTeam } = useApproveTeam();
  const { mutate: rejectTeam } = useRejectTeam();
  const { mutate: suspendTeam } = useSuspendTeam();
  const { mutate: unsuspendTeam } = useUnsuspendTeam();

  const teams = data?.teams ?? [];
  const total = data?.pagination?.total ?? 0;

  const handleApprove = (id: string) => {
    setActionId(id);
    approveTeam(id, {
      onSuccess: () => {
        toast.success("Team approved and set to active.");
        refetch();
        setActionId(null);
      },
      onError: (e: any) => {
        toast.error(e?.response?.data?.message ?? "Failed");
        setActionId(null);
      },
    });
  };

  const handleReject = () => {
    if (!modal || modal.type !== "reject" || !reason.trim()) return;
    setActionId(modal.teamId);
    rejectTeam(
      { id: modal.teamId, rejectionReason: reason.trim() },
      {
        onSuccess: () => {
          toast.success("Team rejected.");
          refetch();
          setModal(null);
          setReason("");
          setActionId(null);
        },
        onError: (e: any) => {
          toast.error(e?.response?.data?.message ?? "Failed");
          setActionId(null);
        },
      },
    );
  };

  const handleSuspend = () => {
    if (!modal || modal.type !== "suspend" || !reason.trim()) return;
    setActionId(modal.teamId);
    suspendTeam(
      { id: modal.teamId, suspendedReason: reason.trim() },
      {
        onSuccess: () => {
          toast.success("Team suspended.");
          refetch();
          setModal(null);
          setReason("");
          setActionId(null);
        },
        onError: (e: any) => {
          toast.error(e?.response?.data?.message ?? "Failed");
          setActionId(null);
        },
      },
    );
  };

  const handleUnsuspend = (id: string) => {
    setActionId(id);
    unsuspendTeam(id, {
      onSuccess: () => {
        toast.success("Team reactivated.");
        refetch();
        setActionId(null);
      },
      onError: (e: any) => {
        toast.error(e?.response?.data?.message ?? "Failed");
        setActionId(null);
      },
    });
  };

  return (
    <div
      className="min-h-screen bg-[#f5f5f0]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-[13px]">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 text-setu-600 font-semibold no-underline hover:text-setu-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">Manage Teams</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-[26px] font-bold text-setu-950 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Team Management
            </h1>
            <p className="text-[14px] text-gray-500 mt-1">
              Review, approve, reject, and manage all teams on the platform.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] text-setu-900 focus:outline-none focus:border-setu-400 transition-all w-56 placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-6 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-[0_1px_6px_rgba(0,0,0,0.04)] w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "px-4 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer border-none capitalize",
                activeTab === tab
                  ? "bg-setu-700 text-white shadow-[0_2px_8px_rgba(21,104,57,0.25)]"
                  : "bg-transparent text-gray-500 hover:text-setu-700 hover:bg-setu-50",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-setu-500" />
            <p className="text-[14px] text-setu-600/60 font-medium">
              Loading teams…
            </p>
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-setu-50 border border-setu-100 rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-setu-300" />
            </div>
            <div className="text-center">
              <p className="text-[16px] font-bold text-setu-900 mb-1">
                No teams found
              </p>
              <p className="text-[14px] text-setu-600/60">
                {search
                  ? `No results for "${search}"`
                  : `No ${activeTab === "all" ? "" : activeTab} teams yet.`}
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[13px] text-gray-500 mb-4 font-medium">
              {total} team{total !== 1 ? "s" : ""} found
            </p>
            <div className="space-y-3">
              {teams.map((team: any) => {
                const st = STATUS_CONFIG[team.status] ?? STATUS_CONFIG.pending;
                const memberCount =
                  team.memberCount ?? team.members?.length ?? 0;
                return (
                  <div
                    key={team._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-setu-100 flex-shrink-0">
                          {team.avatar?.url ? (
                            <img
                              src={team.avatar.url}
                              alt={team.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-setu-700 to-setu-500 flex items-center justify-center">
                              <Users className="w-6 h-6 text-white/70" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3
                                  className="text-[16px] font-bold text-setu-950 truncate"
                                  style={{ fontFamily: "var(--font-display)" }}
                                >
                                  {team.name}
                                </h3>
                                {team.badge && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-full flex-shrink-0">
                                    <Trophy className="w-2.5 h-2.5" />{" "}
                                    {team.badge}
                                  </span>
                                )}
                                <span
                                  className={`flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${st.bg} ${st.color} ${st.border}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                                  />
                                  {st.label}
                                </span>
                              </div>
                              <p className="text-[13px] text-gray-500 line-clamp-1 mb-2">
                                {team.description}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {team.location && (
                                  <span className="flex items-center gap-1 text-[12px] text-gray-400">
                                    <MapPin className="w-3 h-3" />{" "}
                                    {team.location}
                                  </span>
                                )}
                                <span className="flex items-center gap-1 text-[12px] text-gray-400">
                                  <Users className="w-3 h-3" /> {memberCount}{" "}
                                  members
                                </span>
                                <span className="flex items-center gap-1 text-[12px] text-gray-400">
                                  <Clock className="w-3 h-3" />{" "}
                                  {fmtDate(team.createdAt)}
                                </span>
                                {team.createdBy?.name && (
                                  <span className="text-[12px] text-gray-400">
                                    by{" "}
                                    <strong className="text-setu-700">
                                      {team.createdBy.name}
                                    </strong>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <p
                                className="text-[18px] font-black text-setu-950 leading-none"
                                style={{ fontFamily: "var(--font-display)" }}
                              >
                                {fmtNPR(team.raisedAmount)}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                of {fmtNPR(team.goalAmount)} goal
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {(team.rejectionReason || team.suspendedReason) && (
                        <div
                          className={`mt-3 p-3 rounded-xl flex items-start gap-2 ${team.status === "rejected" ? "bg-red-50 border border-red-100" : "bg-amber-50 border border-amber-100"}`}
                        >
                          <AlertTriangle
                            className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${team.status === "rejected" ? "text-red-500" : "text-amber-500"}`}
                          />
                          <p
                            className={`text-[12px] leading-relaxed ${team.status === "rejected" ? "text-red-700" : "text-amber-700"}`}
                          >
                            <strong>Reason:</strong>{" "}
                            {team.rejectionReason ?? team.suspendedReason}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50 flex-wrap">
                        <Link
                          href={`/teams/${team._id}`}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[12px] font-semibold rounded-xl transition-colors no-underline"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>

                        {team.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(team._id)}
                              disabled={actionId === team._id}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-setu-700 hover:bg-setu-600 text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer border-none disabled:opacity-60"
                            >
                              {actionId === team._id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setModal({
                                  type: "reject",
                                  teamId: team._id,
                                  teamName: team.name,
                                });
                                setReason("");
                              }}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[12px] font-bold rounded-xl transition-colors cursor-pointer border-solid"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}

                        {team.status === "active" && (
                          <button
                            onClick={() => {
                              setModal({
                                type: "suspend",
                                teamId: team._id,
                                teamName: team.name,
                              });
                              setReason("");
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[12px] font-bold rounded-xl transition-colors cursor-pointer border-solid"
                          >
                            <PauseCircle className="w-3.5 h-3.5" /> Suspend
                          </button>
                        )}

                        {team.status === "suspended" && (
                          <button
                            onClick={() => handleUnsuspend(team._id)}
                            disabled={actionId === team._id}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-setu-50 hover:bg-setu-100 border border-setu-200 text-setu-700 text-[12px] font-bold rounded-xl transition-colors cursor-pointer border-solid disabled:opacity-60"
                          >
                            {actionId === team._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <PlayCircle className="w-3.5 h-3.5" />
                            )}
                            Reactivate
                          </button>
                        )}

                        {team.status === "rejected" && (
                          <button
                            onClick={() => handleApprove(team._id)}
                            disabled={actionId === team._id}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-setu-700 hover:bg-setu-600 text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer border-none disabled:opacity-60"
                          >
                            {actionId === team._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            Re-approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-[3000] flex items-center justify-center px-4"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModal(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${modal.type === "reject" ? "bg-red-50" : "bg-amber-50"}`}
              >
                {modal.type === "reject" ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <PauseCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div>
                <h3
                  className="text-[16px] font-bold text-setu-950"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {modal.type === "reject" ? "Reject Team" : "Suspend Team"}
                </h3>
                <p className="text-[12px] text-gray-400">{modal.teamName}</p>
              </div>
            </div>
            <p className="text-[13px] text-gray-500 mb-3 leading-relaxed">
              {modal.type === "reject"
                ? "Please provide a reason for rejecting this team. This will be shown to the team creator."
                : "Please provide a reason for suspending this team. This will be shown to the team members."}
            </p>
            <textarea
              placeholder={
                modal.type === "reject"
                  ? "e.g. Incomplete information provided…"
                  : "e.g. Violation of community guidelines…"
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-[13px] text-setu-900 focus:outline-none focus:border-setu-400 focus:bg-white transition-all placeholder:text-gray-300 resize-none mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setModal(null);
                  setReason("");
                }}
                className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 text-[13px] font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={modal.type === "reject" ? handleReject : handleSuspend}
                disabled={!reason.trim() || actionId !== null}
                className={`flex-[2] py-3 text-white text-[13px] font-bold rounded-xl transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${modal.type === "reject" ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}`}
              >
                {actionId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : modal.type === "reject" ? (
                  <>
                    <XCircle className="w-4 h-4" /> Confirm Reject
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4" /> Confirm Suspend
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
