"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle2,
  XCircle,
  LogIn,
  UserPlus,
  Shield,
} from "lucide-react";
import { useValidateInviteToken, useAcceptInvite } from "@/src/hooks/useTeam";

const CATEGORY_LABELS: Record<string, string> = {
  emergency: "Emergency Relief",
  medical: "Medical",
  education: "Education",
  charity: "Charity",
  animals: "Animals",
  environment: "Environment",
};

export default function TeamInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const { data, isLoading, error } = useValidateInviteToken(token);
  const acceptMutation = useAcceptInvite();

  // Check if user is logged in
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const team = data?.data?.team;
  const invite = data?.data?.invite;

  const handleAccept = () => {
    acceptMutation.mutate(token, {
      onSuccess: (res) => {
        router.replace(`/teams/${res.data._id}`);
      },
    });
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-setu-500 animate-spin mx-auto mb-4" />
          <p className="text-[14px] text-gray-500 font-medium">Validating invite…</p>
        </div>
      </div>
    );
  }

  // ── Invalid / expired token ───────────────────────────────────────────────
  if (error || !team) {
    const msg =
      (error as Error)?.message ||
      "This invite link is invalid or has already been used.";
    return (
      <div
        className="min-h-screen bg-cream flex items-center justify-center px-4"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1
            className="text-[26px] font-bold text-setu-950 mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Invite not found
          </h1>
          <p className="text-[14px] text-gray-500 leading-relaxed mb-6">{msg}</p>
          <Link
            href="/teams"
            className="inline-flex items-center gap-2 px-6 py-3 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-xl text-sm transition-all no-underline"
          >
            Browse Teams <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ── Valid invite ──────────────────────────────────────────────────────────
  const registerUrl = `/register?inviteToken=${token}&email=${encodeURIComponent(invite?.email ?? "")}&teamName=${encodeURIComponent(team.name)}`;
  const loginUrl = `/login?next=/teams/invite/${token}`;

  return (
    <div
      className="min-h-screen bg-cream flex items-center justify-center px-4 py-12"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="max-w-lg w-full">
        {/* ── Header pill ── */}
        <div className="flex justify-center mb-8">
          <span className="px-4 py-1.5 bg-setu-100 text-setu-700 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full">
            Team Invitation
          </span>
        </div>

        {/* ── Team card ── */}
        <div className="bg-white rounded-3xl border border-setu-100 shadow-[0_4px_24px_rgba(21,104,57,0.08)] overflow-hidden mb-6">
          {/* Avatar */}
          <div className="h-36 bg-setu-900 relative overflow-hidden">
            {team.avatar?.url ? (
              <img
                src={team.avatar.url}
                alt={team.name}
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="w-16 h-16 text-setu-600/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-setu-950/60 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <span className="px-2.5 py-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-[11px] font-semibold text-white">
                {CATEGORY_LABELS[team.category] ?? team.category}
              </span>
            </div>
          </div>

          <div className="px-6 py-5">
            <h2
              className="text-[22px] font-bold text-setu-950 mb-1.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {team.name}
            </h2>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
              {team.description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 text-[12px] text-gray-500 border-t border-setu-50 pt-4">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-setu-400" />
                {team.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-setu-400" />
                {team.memberCount} member{team.memberCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-setu-400" />
                Invited by {team.createdBy.name}
              </span>
            </div>
          </div>
        </div>

        {/* ── Invite meta ── */}
        {invite?.email && (
          <div className="bg-setu-50 border border-setu-200 rounded-2xl px-5 py-3.5 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-setu-600 flex-shrink-0" />
            <p className="text-[13px] text-setu-700">
              This invite was sent to <strong>{invite.email}</strong>
              {invite.tokenExpiry
                ? ` · expires ${new Date(invite.tokenExpiry).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                : ""}
            </p>
          </div>
        )}

        {/* ── CTA ── */}
        {isLoggedIn ? (
          // Logged-in: show Accept button
          <button
            onClick={handleAccept}
            disabled={acceptMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-4 bg-setu-700 hover:bg-setu-600 disabled:bg-setu-300 text-white font-bold rounded-2xl text-[15px] transition-all shadow-[0_4px_14px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none"
          >
            {acceptMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Joining…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" /> Accept Invitation & Join Team
              </>
            )}
          </button>
        ) : (
          // Not logged in: show two paths
          <div className="space-y-3">
            <Link
              href={registerUrl}
              className="w-full flex items-center justify-center gap-2 py-4 bg-setu-700 hover:bg-setu-600 text-white font-bold rounded-2xl text-[15px] transition-all shadow-[0_4px_14px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 no-underline"
            >
              <UserPlus className="w-5 h-5" /> Create Account & Join
            </Link>
            <Link
              href={loginUrl}
              className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-setu-200 text-setu-700 font-semibold rounded-2xl text-[14px] hover:bg-setu-50 transition-colors no-underline"
            >
              <LogIn className="w-4 h-4" /> Already have an account? Sign in
            </Link>
          </div>
        )}

        <p className="text-center text-[11px] text-gray-400 mt-5">
          By joining, you agree to Setu&apos;s{" "}
          <Link href="/terms" className="text-setu-600 hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
