"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, MapPin, Users, Target, TrendingUp, ShieldCheck,
  ChevronRight, Heart, Trophy, Calendar, UserPlus, Crown,
  Flag, Check, Facebook, Twitter, Link2, Share2, Trash2,
  UserMinus, Mail, Plus, X, Settings, LogOut, Clock,
  AlertTriangle, CheckCircle, XCircle, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetTeamById, useRequestJoinTeam, useLeaveTeam, useRemoveMember,
  useInviteMembers, useDeleteTeam, useApproveJoinRequest, useRejectJoinRequest,
  type JoinRequest,
} from "@/src/hooks/useTeam";
import { useAuth } from "@/src/hooks/useAuth";
import { TeamChatBubble } from "@/src/components/team-chat-bubble";

const fmtNPR = (n: number) =>
  n >= 100000 ? `NPR ${(n / 100000).toFixed(1)}L` : `NPR ${n.toLocaleString()}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-NP", { day: "numeric", month: "long", year: "numeric" });

const fmtTimeAgo = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const QUICK = [500, 1000, 2500, 5000];

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data, isLoading, isError, refetch } = useGetTeamById(id, { refetchOnMount: "always" });
  const { user } = useAuth();

  const { mutate: requestJoin, isPending: requesting } = useRequestJoinTeam();
  const { mutate: leaveTeam, isPending: leaving } = useLeaveTeam();
  const { mutate: removeMember, isPending: removing } = useRemoveMember();
  const { mutate: inviteMembers, isPending: inviting } = useInviteMembers();
  const { mutate: deleteTeam, isPending: deleting } = useDeleteTeam();
  const { mutate: approveRequest, isPending: approvingId } = useApproveJoinRequest();
  const { mutate: rejectRequest, isPending: rejectingId } = useRejectJoinRequest();

  const team = data?.data;

  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteList, setInviteList] = useState<string[]>([]);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ── Derived membership state ──────────────────────────────────────────────
  const isTeamAdmin = useMemo(() => {
    if (!team || !user) return false;
    return (
      team.createdBy?._id === user._id ||
      (team.createdBy as any) === user._id ||
      team.members?.some((m: any) => (m.user?._id === user._id || m.user === user._id) && m.role === "admin")
    );
  }, [team, user]);

  const isMember = useMemo(() => {
    if (!team || !user) return false;
    return team.members?.some((m: any) => m.user?._id === user._id || m.user === user._id);
  }, [team, user]);

  const myJoinRequest = useMemo(() => {
    if (!team || !user) return null;
    return team.joinRequests?.find(
      (r) => r.user?._id === user._id || (r.user as any) === user._id,
    ) ?? null;
  }, [team, user]);

  const hasPendingRequest = myJoinRequest?.status === "pending";
  const hasRejectedRequest = myJoinRequest?.status === "rejected";

  const pendingJoinRequests = useMemo(
    () => (isTeamAdmin ? (team?.joinRequests ?? []).filter((r) => r.status === "pending") : []),
    [team, isTeamAdmin],
  );

  const pct = team ? Math.min(Math.round((team.raisedAmount / team.goalAmount) * 100), 100) : 0;
  const remaining = team ? Math.max(0, team.goalAmount - team.raisedAmount) : 0;
  const memberCount = team?.memberCount ?? team?.members?.length ?? 0;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleRequestJoin = () => {
    requestJoin({ id }, {
      onSuccess: () => refetch(),
      onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed to send request"),
    });
  };

  const handleLeave = () => {
    leaveTeam(id, {
      onSuccess: () => refetch(),
      onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed to leave team"),
    });
  };

  const handleRemoveMember = (memberId: string) => {
    setRemovingMemberId(memberId);
    removeMember({ id, memberId }, {
      onSuccess: () => { refetch(); setRemovingMemberId(null); },
      onError: (e: any) => { toast.error(e?.response?.data?.message ?? "Failed to remove"); setRemovingMemberId(null); },
    });
  };

  const handleApproveRequest = (requestId: string) => {
    approveRequest({ teamId: id, requestId }, {
      onSuccess: () => refetch(),
      onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed to approve"),
    });
  };

  const handleRejectRequest = (requestId: string) => {
    rejectRequest({ teamId: id, requestId }, {
      onSuccess: () => refetch(),
      onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed to reject"),
    });
  };

  const handleAddInviteEmail = () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email || !/\S+@\S+\.\S+/.test(email) || inviteList.includes(email)) return;
    setInviteList((prev) => [...prev, email]);
    setInviteEmail("");
  };

  const handleSendInvites = () => {
    if (inviteList.length === 0) return;
    inviteMembers({ id, emails: inviteList }, {
      onSuccess: (res: any) => { toast.success(res?.message ?? "Invites sent!"); setInviteList([]); },
      onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed to send invites"),
    });
  };

  const handleDeleteTeam = () => {
    deleteTeam(id, {
      onSuccess: () => { toast.success("Team deleted."); router.push("/teams"); },
      onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed to delete team"),
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Support "${team?.name}" on Setu — join us in making a difference! 🙌`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center" style={{ fontFamily: "var(--font-body)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full border-4 border-setu-100 border-t-setu-500 animate-spin absolute" />
            <Users className="absolute inset-0 m-auto w-5 h-5 text-setu-500" />
          </div>
          <p className="text-[14px] text-setu-600/60 font-medium">Loading team…</p>
        </div>
      </div>
    );

  if (isError || !team)
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center" style={{ fontFamily: "var(--font-body)" }}>
        <div className="text-center max-w-sm px-4">
          <div className="w-20 h-20 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-[20px] font-bold text-setu-950 mb-2" style={{ fontFamily: "var(--font-display)" }}>Team not found</h2>
          <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">This team may have been removed or the link is incorrect.</p>
          <Link href="/teams" className="inline-flex items-center gap-2 px-6 py-3 bg-setu-700 text-white font-bold rounded-full text-sm no-underline hover:bg-setu-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Browse Teams
          </Link>
        </div>
      </div>
    );

  return (
    <div className="bg-[#f5f5f0] min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-[13px]">
          <Link href="/teams" className="flex items-center gap-1.5 text-setu-600 font-semibold no-underline hover:text-setu-500 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Teams
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500 truncate max-w-[300px]">{team.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* ── LEFT ── */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {team.badge && (
                  <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border ${team.badge === "Top Team" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-setu-50 text-setu-700 border-setu-200"}`}>
                    {team.badge === "Top Team" && <Trophy className="w-3 h-3 inline mr-1" />}{team.badge}
                  </span>
                )}
                <span className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full border bg-setu-50 border-setu-200 text-setu-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-setu-500 animate-pulse" /> Active Team
                </span>
              </div>
              <h1 className="text-[clamp(22px,2.8vw,36px)] font-bold text-setu-950 leading-tight tracking-[-0.5px]" style={{ fontFamily: "var(--font-display)" }}>
                {team.name}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                {team.location && (
                  <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-setu-400" /> {team.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                  <Users className="w-3.5 h-3.5 text-setu-400" /> {memberCount} members
                </span>
              </div>
            </div>

            {/* Hero image */}
            <div className="rounded-2xl overflow-hidden bg-setu-100 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
              {team.avatar?.url ? (
                <img src={team.avatar.url} alt={team.name} className="w-full object-cover" style={{ aspectRatio: "16/9", maxHeight: "420px" }} />
              ) : (
                <div className="w-full bg-gradient-to-br from-setu-800 to-setu-950 flex items-center justify-center" style={{ aspectRatio: "16/9", maxHeight: "420px" }}>
                  <Users className="w-20 h-20 text-setu-600/40" />
                </div>
              )}
            </div>

            {/* Mobile: sidebar cards */}
            <div className="lg:hidden space-y-4">
              <TeamDonateCard team={team} pct={pct} remaining={remaining} teamId={id} />
              <TeamMembershipCard
                team={team} isMember={!!isMember} isTeamAdmin={!!isTeamAdmin}
                hasPendingRequest={hasPendingRequest} hasRejectedRequest={hasRejectedRequest}
                requesting={requesting} leaving={leaving}
                onRequestJoin={handleRequestJoin} onLeave={handleLeave}
              />
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 sm:px-7 pt-6 pb-5 border-b border-gray-50">
                <h2 className="text-[17px] font-bold text-setu-950" style={{ fontFamily: "var(--font-display)" }}>About this Team</h2>
              </div>
              <div className="px-6 sm:px-7 py-6">
                <p className="text-[15px] text-gray-600 leading-[1.85]">{team.description}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="text-[17px] font-bold text-setu-950" style={{ fontFamily: "var(--font-display)" }}>Fundraising Progress</h2>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-[38px] font-black text-setu-950 leading-none" style={{ fontFamily: "var(--font-display)" }}>{fmtNPR(team.raisedAmount)}</span>
                  <span className="text-[14px] text-gray-400 mb-1.5">raised of <span className="font-bold text-setu-700">{fmtNPR(team.goalAmount)}</span></span>
                </div>
                <div className="h-5 bg-gray-100 rounded-full overflow-hidden mb-2 relative">
                  <div className="h-full bg-gradient-to-r from-setu-700 via-setu-500 to-setu-400 rounded-full transition-all duration-700 flex items-center justify-end pr-2" style={{ width: `${Math.max(pct, 3)}%` }}>
                    {pct > 8 && <span className="text-[10px] font-black text-white leading-none">{pct}%</span>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    { label: "Funded", value: `${pct}%`, color: "text-setu-700" },
                    { label: "Members", value: memberCount.toString(), color: "text-setu-950" },
                    { label: "Campaigns", value: (team.campaignCount ?? team.campaigns?.length ?? 0).toString(), color: "text-setu-950" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                      <p className={`text-[24px] font-black leading-none ${color}`} style={{ fontFamily: "var(--font-display)" }}>{value}</p>
                      <p className="text-[11px] text-gray-400 font-medium mt-1.5">{label}</p>
                    </div>
                  ))}
                </div>
                {remaining > 0 && (
                  <div className="mt-4 p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-center">
                    <p className="text-[12px] text-amber-700 font-semibold">{fmtNPR(remaining)} still needed to reach the team goal</p>
                  </div>
                )}
              </div>
            </div>

            {/* Members */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-[17px] font-bold text-setu-950" style={{ fontFamily: "var(--font-display)" }}>Team Members</h2>
                <span className="text-[12px] font-semibold text-setu-600">{memberCount} total</span>
              </div>
              <div className="divide-y divide-gray-50">
                {(team.members ?? []).map((member: any, i: number) => {
                  const memberUser = member.user;
                  const memberId = memberUser?._id ?? member.user;
                  const isCreator = team.createdBy?._id === memberId || (team.createdBy as any) === memberId;
                  const name = memberUser?.name ?? "Member";
                  const initial = name[0]?.toUpperCase() ?? "M";
                  return (
                    <div key={i} className="flex items-center gap-4 px-6 py-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-setu-600 to-setu-400 flex items-center justify-center">
                          <span className="text-white text-[13px] font-bold">{initial}</span>
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-gray-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-semibold text-setu-900">{name}</p>
                          {(isCreator || member.role === "admin") && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-full">
                              <Crown className="w-2.5 h-2.5" /> {isCreator ? "Leader" : "Admin"}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-gray-400">{memberUser?.email ?? ""}</p>
                      </div>
                      {isTeamAdmin && !isCreator && memberId !== user?._id && (
                        <button
                          onClick={() => handleRemoveMember(memberId)}
                          disabled={removingMemberId === memberId}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                          {removingMemberId === memberId ? "Removing…" : "Remove"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Admin: Pending Join Requests ─────────────────────────────── */}
            {isTeamAdmin && pendingJoinRequests.length > 0 && (
              <div className="bg-white rounded-2xl border border-amber-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="px-6 py-4 border-b border-amber-50 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-700 text-[10px] font-black">{pendingJoinRequests.length}</span>
                  </div>
                  <h2 className="text-[17px] font-bold text-setu-950" style={{ fontFamily: "var(--font-display)" }}>
                    Pending Join Requests
                  </h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {pendingJoinRequests.map((req: JoinRequest) => {
                    const name = req.user?.name ?? "Unknown";
                    const initial = name[0]?.toUpperCase() ?? "?";
                    return (
                      <div key={req._id} className="flex items-center gap-4 px-6 py-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[13px] font-bold">{initial}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-setu-900">{name}</p>
                          <p className="text-[12px] text-gray-400">{req.user?.email}</p>
                          {req.message && (
                            <p className="text-[12px] text-gray-500 italic mt-0.5">"{req.message}"</p>
                          )}
                          <p className="text-[11px] text-gray-400 mt-0.5">{fmtTimeAgo(req.requestedAt)}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleApproveRequest(req._id)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-setu-700 hover:bg-setu-600 text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer border-none"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req._id)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-600 hover:text-red-600 text-[12px] font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Admin: Manage Team ───────────────────────────────────────── */}
            {isTeamAdmin && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-setu-500" />
                  <h2 className="text-[17px] font-bold text-setu-950" style={{ fontFamily: "var(--font-display)" }}>Manage Team</h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Invite by email */}
                  <div>
                    <p className="text-[13px] font-bold text-setu-800 mb-1">Invite Members by Email</p>
                    <p className="text-[12px] text-gray-400 mb-3 leading-relaxed">Invited users bypass the join request flow and are added directly.</p>
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          type="email"
                          placeholder="email@example.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddInviteEmail(); } }}
                          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-[13px] text-setu-900 focus:outline-none focus:border-setu-400 focus:bg-white transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <button
                        onClick={handleAddInviteEmail}
                        className="px-4 py-2.5 bg-setu-50 hover:bg-setu-100 border-2 border-setu-200 text-setu-700 text-[13px] font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                    {inviteList.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {inviteList.map((email) => (
                          <div key={email} className="flex items-center gap-1.5 px-3 py-1.5 bg-setu-50 border border-setu-200 rounded-full">
                            <span className="text-[12px] font-semibold text-setu-700">{email}</span>
                            <button
                              onClick={() => setInviteList((prev) => prev.filter((e) => e !== email))}
                              className="text-setu-400 hover:text-setu-600 cursor-pointer border-none bg-transparent"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {inviteList.length > 0 && (
                      <button
                        onClick={handleSendInvites}
                        disabled={inviting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white text-[13px] font-bold rounded-xl transition-all cursor-pointer border-none disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(21,104,57,0.25)]"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {inviting ? "Sending…" : `Send ${inviteList.length} Invite${inviteList.length > 1 ? "s" : ""}`}
                      </button>
                    )}
                  </div>

                  <div className="h-px bg-gray-100" />

                  

                  {/* Danger zone */}
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="text-[13px] font-bold text-red-700 mb-1">Danger Zone</p>
                    <p className="text-[12px] text-red-600 mb-3 leading-relaxed">Permanently delete this team. This cannot be undone.</p>
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-500 text-[12px] font-bold rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Team
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[12px] font-semibold text-red-700 w-full">Are you sure? This cannot be undone.</p>
                        <button
                          onClick={handleDeleteTeam}
                          disabled={deleting}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer border-none disabled:opacity-60"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> {deleting ? "Deleting…" : "Yes, Delete"}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-[12px] font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Share */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] p-6">
              <h2 className="text-[17px] font-bold text-setu-950 mb-2" style={{ fontFamily: "var(--font-display)" }}>Sharing helps more than you think</h2>
              <p className="text-[13px] text-gray-500 mb-5 leading-relaxed">Each share brings in new members and donors. Help grow this team's impact.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleShareFacebook} className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white text-[13px] font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none">
                  <Facebook className="w-4 h-4" /> Facebook
                </button>
                <button onClick={handleShareTwitter} className="flex items-center gap-2 px-5 py-2.5 bg-[#1DA1F2] text-white text-[13px] font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none">
                  <Twitter className="w-4 h-4" /> Twitter
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-bold rounded-xl transition-colors cursor-pointer border-none"
                >
                  {copied ? <Check className="w-4 h-4 text-setu-500" /> : <Link2 className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>
            </div>

            {/* Team details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="text-[17px] font-bold text-setu-950" style={{ fontFamily: "var(--font-display)" }}>Team Details</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { label: "Location", value: team.location, icon: MapPin },
                  { label: "Goal", value: fmtNPR(team.goalAmount), icon: Target },
                  { label: "Raised", value: fmtNPR(team.raisedAmount), icon: TrendingUp },
                  { label: "Members", value: `${memberCount} people`, icon: Users },
                  { label: "Campaigns", value: `${team.campaignCount ?? team.campaigns?.length ?? 0} campaigns`, icon: Heart },
                  { label: "Created", value: team.createdAt ? fmtDate(team.createdAt) : "—", icon: Calendar },
                ].filter((r) => r.value).map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-4 px-6 py-3.5">
                    <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-setu-500" />
                    </div>
                    <span className="text-[13px] text-gray-400 font-medium w-24 flex-shrink-0">{label}</span>
                    <span className="text-[13px] font-semibold text-setu-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave team (mobile) */}
            {isMember && !isTeamAdmin && (
              <button
                onClick={handleLeave}
                disabled={leaving}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-red-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer text-[14px] disabled:opacity-60"
              >
                <LogOut className="w-4 h-4" />
                {leaving ? "Leaving…" : "Leave Team"}
              </button>
            )}

            <Link
              href="/teams"
              className="flex items-center justify-between p-5 bg-setu-50 border border-setu-100 rounded-2xl no-underline hover:bg-setu-100 transition-colors group"
            >
              <div>
                <p className="text-[14px] font-bold text-setu-800">Browse more teams</p>
                <p className="text-[12px] text-setu-600/60 mt-0.5">Discover other teams making a difference</p>
              </div>
              <ChevronRight className="w-5 h-5 text-setu-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* ── RIGHT sticky sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <TeamDonateCard team={team} pct={pct} remaining={remaining} teamId={id} />
              <TeamMembershipCard
                team={team} isMember={!!isMember} isTeamAdmin={!!isTeamAdmin}
                hasPendingRequest={hasPendingRequest} hasRejectedRequest={hasRejectedRequest}
                requesting={requesting} leaving={leaving}
                onRequestJoin={handleRequestJoin} onLeave={handleLeave}
              />

              {/* Share */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
                <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-3">Share this team</p>
                <div className="flex flex-col gap-2">
                  <button onClick={handleShareFacebook} className="flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] text-white text-[13px] font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none w-full">
                    <Facebook className="w-4 h-4" /> Share on Facebook
                  </button>
                  <button onClick={handleShareTwitter} className="flex items-center justify-center gap-2 py-2.5 bg-[#1DA1F2] text-white text-[13px] font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none w-full">
                    <Twitter className="w-4 h-4" /> Share on Twitter
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-semibold rounded-xl transition-colors cursor-pointer border-none w-full"
                  >
                    {copied ? <><Check className="w-4 h-4 text-setu-500" /> Copied!</> : <><Link2 className="w-4 h-4" /> Copy link</>}
                  </button>
                </div>
              </div>

              {/* Trust */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)] space-y-3">
                {[
                  { icon: ShieldCheck, text: "100% verified by Setu team" },
                  { icon: Heart, text: "95% of funds go to the cause" },
                  { icon: Users, text: "Full donor transparency" },
                  { icon: Flag, text: "Report if something's wrong" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-[12px] text-gray-500">
                    <Icon className="w-3.5 h-3.5 text-setu-400 flex-shrink-0" />{text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 leading-none font-medium uppercase tracking-wide">Raised</p>
            <p className="text-[16px] font-black text-setu-800 leading-tight">{fmtNPR(team.raisedAmount)}</p>
          </div>
          <Link
            href={`/teams/${id}/donate`}
            className="flex-[2] py-3.5 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-xl text-[14px] text-center transition-colors shadow-[0_4px_14px_rgba(21,104,57,0.35)] no-underline flex items-center justify-center"
          >
            Donate Now
          </Link>
          <button
            onClick={handleCopy}
            className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 cursor-pointer flex-shrink-0 hover:bg-gray-200 transition-colors border-none"
          >
            {copied ? <Check className="w-4 h-4 text-setu-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className="lg:hidden h-24" />

      {/* Team chat bubble — only for approved members */}
      {isMember && <TeamChatBubble teamId={id} teamName={team.name} enabled={true} />}
    </div>
  );
}

// ── Team Donate Card ───────────────────────────────────────────────────────────
function TeamDonateCard({
  team, pct, remaining, teamId,
}: {
  team: any; pct: number; remaining: number; teamId: string;
}) {
  const [sel, setSel] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const donationAmt = sel ?? (custom ? parseInt(custom) : 0);
  const displayAmt = donationAmt >= 10 ? `NPR ${donationAmt.toLocaleString()}` : "";
  const memberCount = team.memberCount ?? team.members?.length ?? 0;
  const exceedsMax = donationAmt > 30000;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="px-5 py-4 bg-setu-950 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1">Team raised</p>
        <p className="text-[32px] font-black leading-none" style={{ fontFamily: "var(--font-display)" }}>{fmtNPR(team.raisedAmount)}</p>
        <p className="text-[12px] text-white/40 mt-1">of {fmtNPR(team.goalAmount)} goal</p>
      </div>
      <div className="p-5">
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-gradient-to-r from-setu-700 to-setu-400 rounded-full" style={{ width: `${Math.max(pct, 2)}%` }} />
        </div>
        <div className="flex justify-between text-[12px] text-gray-500 mb-5">
          <span className="font-black text-setu-700">{pct}% of goal</span>
          <span>{memberCount} members</span>
        </div>

        {/* Quick amounts */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {QUICK.map((amt) => (
            <button
              key={amt}
              onClick={() => { setSel(amt); setCustom(""); }}
              className={["py-2.5 rounded-xl text-[12px] font-bold border-2 transition-all cursor-pointer",
                sel === amt ? "bg-setu-700 text-white border-setu-700" : "bg-white text-setu-700 border-gray-200 hover:border-setu-300"].join(" ")}
            >
              {amt >= 1000 ? `${amt / 1000}K` : amt}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="relative mb-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400 pointer-events-none">NPR</span>
          <input
            type="number"
            placeholder="Custom amount"
            value={custom}
            min={10}
            max={30000}
            onChange={(e) => { setCustom(e.target.value); setSel(null); }}
            className={`w-full pl-14 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-[13px] text-setu-900 focus:outline-none focus:bg-white transition-all placeholder:text-gray-300 ${exceedsMax ? "border-red-400 focus:border-red-400" : "border-gray-100 focus:border-setu-400"}`}
          />
        </div>

        {exceedsMax && (
          <p className="text-[11px] text-red-500 font-semibold mb-3 flex items-center gap-1">
            <span>⚠</span> Maximum donation amount is NPR 30,000
          </p>
        )}
        {!exceedsMax && <div className="mb-3" />}

        {exceedsMax ? (
          <button
            disabled
            className="w-full py-3.5 bg-red-100 text-red-400 font-bold rounded-xl text-[14px] cursor-not-allowed border-none"
          >
            Amount exceeds NPR 30,000 limit
          </button>
        ) : (
          <Link
            href={donationAmt >= 10 ? `/teams/${teamId}/donate?amount=${donationAmt}` : `/teams/${teamId}/donate`}
            className="w-full py-3.5 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-xl text-[14px] transition-all shadow-[0_4px_14px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 no-underline flex items-center justify-center"
          >
            {displayAmt ? `Donate ${displayAmt}` : "Donate Now"}
          </Link>
        )}

        {remaining > 0 && (
          <p className="text-[11px] text-center text-amber-600 font-semibold mt-3">{fmtNPR(remaining)} still needed</p>
        )}
        <p className="text-[11px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-setu-400" /> Verified by Setu
        </p>
      </div>
    </div>
  );
}

// ── Team Membership Card ───────────────────────────────────────────────────────
function TeamMembershipCard({
  team, isMember, isTeamAdmin, hasPendingRequest, hasRejectedRequest,
  requesting, leaving, onRequestJoin, onLeave,
}: {
  team: any; isMember: boolean; isTeamAdmin: boolean;
  hasPendingRequest: boolean; hasRejectedRequest: boolean;
  requesting: boolean; leaving: boolean;
  onRequestJoin: () => void; onLeave: () => void;
}) {
  if (isTeamAdmin || isMember) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 bg-setu-50 border border-setu-200 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-setu-600" />
          </div>
          <p className="text-[13px] font-bold text-setu-800">
            {isTeamAdmin ? "You manage this team" : "You're a member"}
          </p>
        </div>
        {!isTeamAdmin && (
          <button
            onClick={onLeave}
            disabled={leaving}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-[13px] disabled:opacity-60"
          >
            <LogOut className="w-3.5 h-3.5" />
            {leaving ? "Leaving…" : "Leave Team"}
          </button>
        )}
      </div>
    );
  }

  if (hasPendingRequest) {
    return (
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-bold text-amber-800">Request Pending</p>
            <p className="text-[12px] text-amber-600 leading-relaxed mt-0.5">Your join request is awaiting admin approval. You'll be able to join and chat once approved.</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasRejectedRequest) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-3 mb-3">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-bold text-gray-700">Request Declined</p>
            <p className="text-[12px] text-gray-400 leading-relaxed mt-0.5">Your previous request was declined. You can send a new one.</p>
          </div>
        </div>
        <button
          onClick={onRequestJoin}
          disabled={requesting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-400 text-white font-bold rounded-xl text-[13px] transition-all cursor-pointer border-none disabled:cursor-not-allowed"
        >
          <UserPlus className="w-4 h-4" />
          {requesting ? "Sending…" : "Request Again"}
        </button>
      </div>
    );
  }

  // Not a member, no pending request
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <p className="text-[12px] text-gray-500 leading-relaxed mb-3">
        Join this team to collaborate, chat, and contribute to shared fundraising goals.
      </p>
      <button
        onClick={onRequestJoin}
        disabled={requesting}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-400 text-white font-bold rounded-xl text-[14px] transition-all shadow-[0_4px_14px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 disabled:cursor-not-allowed cursor-pointer border-none"
      >
        <UserPlus className="w-4 h-4" />
        {requesting ? "Sending Request…" : "Request to Join"}
      </button>
      <p className="text-[11px] text-center text-gray-400 mt-2">Admin approval required to join</p>
    </div>
  );
}