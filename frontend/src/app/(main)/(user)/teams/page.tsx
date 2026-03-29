"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Trophy,
  ArrowRight,
  TrendingUp,
  UserPlus,
  Globe,
  Target,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Toaster } from "sonner";
import { TeamCard } from "@/src/components/team-card";
import {
  useGetAllTeams,
  useGetTeamLeaderboard,
  useJoinTeam,
  type Team,
} from "@/src/hooks/useTeam";

interface CardTeam {
  id: string;
  name: string;
  desc: string;
  members: number;
  raised: number;
  goal: number;
  campaigns: number;
  avatar: string;
  location: string;
  badge?: string | null;
  rank?: number;
}

const transformTeam = (t: Team, rank?: number): CardTeam => ({
  id: t._id,
  name: t.name,
  desc: t.description,
  members: t.memberCount ?? t.members.length,
  raised: t.raisedAmount,
  goal: t.goalAmount,
  campaigns: t.campaignCount ?? t.campaigns.length,
  avatar: t.avatar?.url ?? "",
  location: t.location,
  badge: t.badge ?? null,
  rank,
});

const fmtAmt = (n: number) =>
  n >= 100000 ? `NPR ${(n / 100000).toFixed(1)}L` : `NPR ${n.toLocaleString()}`;

export default function TeamsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<Team[]>([]);

  const isMounted = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetAllTeams({
    page,
    limit: 9,
    privacy: "public",
    sortBy: "raisedAmount",
    order: "desc",
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });

  const { data: leaderboardData, isLoading: leaderboardLoading } =
    useGetTeamLeaderboard(3);

  const { mutate: joinTeam } = useJoinTeam();

  useEffect(() => {
    if (!data?.teams) return;
    const teams = data.teams;
    if (page === 1) {
      setAccumulated(teams);
    } else {
      setAccumulated((prev) => {
        const seen = new Set(prev.map((t) => t._id));
        return [...prev, ...teams.filter((t) => !seen.has(t._id))];
      });
    }
  }, [data?.teams, page]);

  const totalPages = data?.pagination?.totalPages ?? 1;
  const hasMore = page < totalPages;

  const displayTeams = accumulated.map((t) => transformTeam(t));
  const leaderboardTeams = leaderboardData?.data ?? [];

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

      <div
        className="bg-cream min-h-screen"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <section className="bg-white border-b border-setu-100 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-end">
              <div>
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
                  <div className="w-6 h-[2px] bg-setu-500 rounded" />
                  Collective Impact
                </div>
                <h1
                  className="text-[clamp(34px,4vw,54px)] font-bold text-setu-950 leading-tight tracking-[-1px] mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Stronger Together.
                  <br />
                  <em className="italic text-setu-600">Team Fundraising.</em>
                </h1>
                <p className="text-[16px] text-setu-800/55 leading-[1.75] max-w-lg mb-8">
                  Join or create a team to multiply your impact. Coordinate
                  campaigns, track collective progress, and celebrate shared
                  milestones.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link
                    href="/teams/create"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-setu-700 hover:bg-setu-600 text-white text-[14px] font-bold rounded-full no-underline shadow-[0_6px_20px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Create a Team
                  </Link>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-setu-400" />
                    <input
                      type="text"
                      placeholder="Search teams..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-11 pr-4 py-3.5 bg-setu-50 border border-setu-200 rounded-full text-[14px] text-setu-900 placeholder:text-setu-400 focus:outline-none focus:border-setu-500 focus:ring-2 focus:ring-setu-500/20 w-64 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-setu-950 rounded-3xl p-6 min-w-[280px]">
                <div className="flex items-center gap-2 mb-5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-[12px] font-bold text-white/60 uppercase tracking-wide">
                    Top Teams
                  </span>
                </div>

                {leaderboardLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-setu-400" />
                  </div>
                ) : leaderboardTeams.length === 0 ? (
                  <p className="text-[12px] text-white/30 text-center py-6">
                    No teams yet
                  </p>
                ) : (
                  leaderboardTeams.map((t, i) => (
                    <div
                      key={t._id}
                      className={`flex items-center gap-3 py-3 ${
                        i < leaderboardTeams.length - 1
                          ? "border-b border-white/[0.06]"
                          : ""
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 ${
                          i === 0
                            ? "bg-amber-400 text-amber-950"
                            : i === 1
                              ? "bg-slate-400 text-white"
                              : "bg-orange-600 text-white"
                        }`}
                      >
                        {t.rank}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-setu-700 border-2 border-white/20 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {t.avatar?.url ? (
                          <img
                            src={t.avatar.url}
                            alt={t.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-4 h-4 text-setu-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-bold text-white truncate">
                          {t.name}
                        </p>
                        <p className="text-[11px] text-setu-400 font-medium">
                          {fmtAmt(t.raisedAmount)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-setu-100">
              {[
                { icon: Users, n: "140+", l: "Active Teams" },
                { icon: Globe, n: "77", l: "Districts Covered" },
                { icon: Target, n: "38+", l: "Team Campaigns" },
                { icon: TrendingUp, n: "NPR 1.2Cr+", l: "Team Raised" },
              ].map(({ icon: Icon, n, l }) => (
                <div key={l} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-setu-50 border border-setu-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-setu-600" />
                  </div>
                  <div>
                    <p
                      className="text-[16px] font-bold text-setu-900 leading-none"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
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

        <section className="py-16 bg-setu-50 border-b border-setu-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: UserPlus,
                  title: "Invite Your Network",
                  desc: "Rally friends, colleagues, and community members. Every team member brings new donors.",
                  color: "text-setu-600",
                  bg: "bg-setu-50",
                },
                {
                  icon: Target,
                  title: "Set Shared Goals",
                  desc: "Create team campaigns with combined targets. Track collective progress in real-time.",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: Trophy,
                  title: "Earn Recognition",
                  desc: "Top teams appear on the Hall of Fame and receive verified badges and exclusive rewards.",
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl p-7 border border-setu-100 hover:shadow-[0_8px_28px_rgba(21,104,57,0.08)] transition-shadow"
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
                  <p className="text-[14px] text-gray-500 leading-[1.7]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-[22px] font-bold text-setu-950"
                style={{ fontFamily: "var(--font-display)" }}
              >
                All Teams
              </h2>
              <span className="text-[13px] text-setu-600/60">
                {isLoading && page === 1
                  ? "Loading…"
                  : `${data?.pagination?.total ?? displayTeams.length} teams`}
              </span>
            </div>

            {isLoading && page === 1 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-setu-500" />
                <p className="text-[14px] text-setu-600/60 font-medium">
                  Loading teams…
                </p>
              </div>
            ) : displayTeams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 bg-setu-50 border border-setu-100 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 text-setu-300" />
                </div>
                <div className="text-center">
                  <p className="text-[16px] font-bold text-setu-900 mb-1">
                    No teams found
                  </p>
                  <p className="text-[14px] text-setu-600/60">
                    {debouncedSearch
                      ? `No results for "${debouncedSearch}".`
                      : "Be the first to create a team!"}
                  </p>
                </div>
                {debouncedSearch && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="px-5 py-2.5 bg-setu-700 text-white text-[13px] font-semibold rounded-full hover:bg-setu-600 transition-colors cursor-pointer border-none"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayTeams.map((t) => (
                    <TeamCard key={t.id} t={t} />
                  ))}
                </div>

                <div className="flex justify-center mt-10">
                  {hasMore ? (
                    <button
                      onClick={() => {
                        if (!isFetching) setPage((p) => p + 1);
                      }}
                      disabled={isFetching}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-setu-50 border border-setu-200 hover:border-setu-400 text-setu-700 text-[14px] font-semibold rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isFetching ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                        </>
                      ) : (
                        <>
                          Load More Teams <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : displayTeams.length > 0 ? (
                    <p className="text-[13px] text-setu-600/50 font-medium">
                      All teams loaded
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="py-16 mx-4 sm:mx-6 lg:mx-8 mb-16">
          <div className="bg-gradient-to-br from-setu-900 to-setu-950 rounded-[28px] p-12 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(34,160,91,0.2) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <div className="w-16 h-16 bg-setu-700/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-setu-300" />
              </div>
              <h2
                className="text-[clamp(26px,3vw,40px)] font-bold text-white mb-4 tracking-[-0.5px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Build Your Dream Team
              </h2>
              <p className="text-[15px] text-white/50 max-w-md mx-auto mb-8 leading-[1.75]">
                Unite your community, friends, or organization around causes
                that matter. Create a team and start making collective impact.
              </p>
              <Link
                href="/teams/create"
                className="inline-flex items-center gap-2 px-8 py-4 bg-setu-500 hover:bg-setu-400 text-white text-[15px] font-bold rounded-full no-underline shadow-[0_8px_28px_rgba(34,160,91,0.4)] hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-5 h-5" /> Create a Team{" "}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
