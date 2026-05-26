"use client";

import Link from "next/link";
import {
  Trophy,
  Medal,
  Star,
  Users,
  Crown,
  Award,
  ArrowRight,
  ChevronRight,
  MapPin,
  Flame,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  useGetLeaderboard,
  type HallOfFameDonor as Donor,
  type HallOfFameTeam as TeamEntry,
} from "@/src/hooks/useHallOfFame";

const fmtNPR = (n: number) =>
  n >= 100000 ? `NPR ${(n / 100000).toFixed(1)}L` : `NPR ${n.toLocaleString()}`;

const badgeConfig = {
  gold: {
    bg: "from-amber-100 to-amber-500",
    ring: "ring-amber-400",
    icon: Crown,
    iconColor: "text-amber-600",
    label: "Gold Donor",
    threshold: "NPR 2L+",
  },
  silver: {
    bg: "from-slate-100 to-slate-400",
    ring: "ring-slate-300",
    icon: Medal,
    iconColor: "text-slate-500",
    label: "Silver Donor",
    threshold: "NPR 1L–2L",
  },
  bronze: {
    bg: "from-orange-100 to-orange-600",
    ring: "ring-orange-400",
    icon: Award,
    iconColor: "text-orange-700",
    label: "Bronze Donor",
    threshold: "NPR 50K–1L",
  },
} as const;

const TEAM_RANK_STYLE = [
  "bg-amber-400 text-amber-950",
  "bg-slate-400 text-white",
  "bg-orange-500 text-white",
];

function AvatarFallback({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <div
      className="rounded-full bg-gradient-to-br from-setu-700 to-setu-500 flex items-center justify-center flex-shrink-0 border-2 border-setu-100"
      style={{ width: size, height: size }}
    >
      <span className="text-white font-black" style={{ fontSize: size * 0.35 }}>
        {name?.[0]?.toUpperCase() ?? "?"}
      </span>
    </div>
  );
}

export default function HallOfFamePage() {
  const { data, isLoading, isError } = useGetLeaderboard({
    donorLimit: 10,
    teamLimit: 3,
  });

  const donors: Donor[] = data?.donors ?? [];
  const teams: TeamEntry[] = data?.teams ?? [];
  const top3 = donors.slice(0, 3);
  const rest = donors.slice(3);

  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ── HERO ── */}
      <section className="bg-setu-950 py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,160,91,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-setu-800/30 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-setu-800/40 rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="w-16 h-16 bg-amber-400/20 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <div className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-400 mb-4">
            <div className="w-6 h-[2px] bg-setu-500 rounded" />
            Top Contributors
            <div className="w-6 h-[2px] bg-setu-500 rounded" />
          </div>
          <h1
            className="text-[clamp(38px,5vw,64px)] font-bold text-white leading-[1.05] tracking-[-1.5px] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Hall of Fame
          </h1>
          <p className="text-[17px] text-white/45 max-w-lg mx-auto leading-[1.75]">
            Celebrating the generous souls whose contributions are transforming
            lives across Nepal every single day.
          </p>
        </div>
      </section>

      {/* ── LOADING ── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full border-4 border-setu-100 border-t-setu-500 animate-spin absolute" />
            <Trophy className="absolute inset-0 m-auto w-5 h-5 text-setu-500" />
          </div>
          <p className="text-[14px] text-setu-600/60 font-medium">
            Loading leaderboard…
          </p>
        </div>
      )}

      {/* ── ERROR ── */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-[15px] font-bold text-setu-950">
            Failed to load leaderboard
          </p>
          <p className="text-[13px] text-gray-400">
            Please try refreshing the page.
          </p>
        </div>
      )}

      {/* ── PODIUM — TOP 3 ── */}
      {!isLoading && !isError && top3.length >= 3 && (
        <section className="py-16 bg-white border-b border-setu-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-center gap-6 sm:gap-10 mb-4">
              {/* Visual order: 2nd, 1st, 3rd */}
              {[top3[1], top3[0], top3[2]].map((d) => {
                const cfg = d.badge ? badgeConfig[d.badge] : badgeConfig.bronze;
                const isFirst = d.rank === 1;
                const podiumH =
                  d.rank === 1
                    ? "h-[140px]"
                    : d.rank === 2
                      ? "h-[100px]"
                      : "h-[80px]";
                return (
                  <div key={d.rank} className="flex flex-col items-center">
                    <div className="relative mb-3">
                      {d.avatar ? (
                        <img
                          src={d.avatar}
                          alt={d.name}
                          className={`rounded-full object-cover border-4 border-white shadow-xl ring-2 ${cfg.ring}`}
                          style={{
                            width: isFirst ? 96 : 72,
                            height: isFirst ? 96 : 72,
                          }}
                        />
                      ) : (
                        <div
                          className={`rounded-full border-4 border-white shadow-xl ring-2 ${cfg.ring}`}
                          style={{
                            width: isFirst ? 96 : 72,
                            height: isFirst ? 96 : 72,
                          }}
                        >
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-setu-700 to-setu-500 flex items-center justify-center">
                            <span
                              className="text-white font-black"
                              style={{ fontSize: isFirst ? 32 : 24 }}
                            >
                              {d.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                      <div
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-b ${cfg.bg} flex items-center justify-center border-2 border-white shadow`}
                      >
                        <cfg.icon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
                      </div>
                    </div>

                    <p
                      className={`font-bold text-setu-900 text-center mb-0.5 ${isFirst ? "text-[16px]" : "text-[14px]"}`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {d.name}
                    </p>
                    <p
                      className={`font-semibold text-setu-600 text-center mb-1 ${isFirst ? "text-[15px]" : "text-[13px]"}`}
                    >
                      {fmtNPR(d.totalDonated)}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-3">
                      <MapPin className="w-3 h-3" />
                      {d.location}
                    </div>

                    <div
                      className={`w-28 sm:w-32 ${podiumH} bg-gradient-to-b ${cfg.bg} rounded-t-2xl flex flex-col items-center justify-start pt-4`}
                    >
                      <span
                        className={`font-black text-white/80 ${isFirst ? "text-[32px]" : "text-[24px]"}`}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {d.rank}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FULL LEADERBOARD ── */}
      {!isLoading && !isError && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_380px] gap-8">
              {/* ── Individual donors (rank 4+) ── */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-[22px] font-bold text-setu-950"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Individual Donors
                  </h2>
                  <span className="text-[13px] text-setu-600/55 font-medium">
                    All time
                  </span>
                </div>

                {rest.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-2xl border border-setu-100">
                    <Trophy className="w-8 h-8 text-setu-200" />
                    <p className="text-[14px] font-bold text-setu-800">
                      No donors yet
                    </p>
                    <p className="text-[13px] text-gray-400">
                      Be the first to make the leaderboard!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {rest.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center gap-4 px-5 py-4 bg-white rounded-2xl border border-setu-100 hover:bg-setu-50 hover:border-setu-200 hover:shadow-[0_4px_16px_rgba(21,104,57,0.08)] transition-all duration-200"
                      >
                        <div
                          className="w-9 h-9 bg-setu-700 text-white rounded-xl flex items-center justify-center text-[13px] font-black flex-shrink-0"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {d.rank}
                        </div>

                        {d.avatar ? (
                          <img
                            src={d.avatar}
                            alt={d.name}
                            className="w-11 h-11 rounded-full border-2 border-setu-100 object-cover flex-shrink-0"
                          />
                        ) : (
                          <AvatarFallback name={d.name} size={44} />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[15px] font-bold text-setu-900">
                              {d.name}
                            </p>
                            {d.badge &&
                              (() => {
                                const cfg = badgeConfig[d.badge];
                                return (
                                  <span
                                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${cfg.bg} text-white`}
                                  >
                                    <cfg.icon className="w-3 h-3" /> {cfg.label}
                                  </span>
                                );
                              })()}
                            {d.donationStreak > 3 && (
                              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                                <Flame className="w-3 h-3" />
                                {d.donationStreak}mo streak
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[12px] text-setu-600/55 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {d.location}
                            </span>
                            <span className="text-[12px] text-setu-600/55">
                              {d.campaignsSupported} campaigns
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-[15px] font-bold text-setu-800">
                            {fmtNPR(d.totalDonated)}
                          </p>
                          <p className="text-[11px] text-setu-600/55">
                            {d.donationsCount} donations
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Side panel ── */}
              <div className="space-y-6">
                {/* Teams leaderboard */}
                <div className="bg-white rounded-2xl border border-setu-100 p-6 shadow-[0_2px_12px_rgba(21,104,57,0.06)]">
                  <div className="flex items-center gap-2 mb-5">
                    <Users className="w-4 h-4 text-setu-600" />
                    <h3
                      className="text-[16px] font-bold text-setu-950"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Top Teams
                    </h3>
                  </div>

                  {teams.length === 0 ? (
                    <p className="text-[13px] text-gray-400 text-center py-4">
                      No teams yet
                    </p>
                  ) : (
                    teams.map((t, i) => (
                      <Link
                        key={t.id}
                        href={`/teams/${t.id}`}
                        className={`flex items-center gap-3 py-3.5 hover:bg-setu-50 px-2 rounded-xl transition-colors no-underline block ${i < teams.length - 1 ? "border-b border-setu-50" : ""}`}
                      >
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black flex-shrink-0 ${TEAM_RANK_STYLE[i] ?? "bg-setu-100 text-setu-700"}`}
                        >
                          {t.rank}
                        </span>
                        {t.avatar ? (
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-9 h-9 rounded-full border-2 border-setu-100 object-cover flex-shrink-0"
                          />
                        ) : (
                          <AvatarFallback name={t.name} size={36} />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-bold text-setu-900 truncate">
                            {t.name}
                          </p>
                          <p className="text-[11px] text-setu-600/60">
                            {fmtNPR(t.totalRaised)} · {t.members} members
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-setu-300 flex-shrink-0" />
                      </Link>
                    ))
                  )}

                  <Link
                    href="/teams"
                    className="flex items-center justify-center gap-1.5 mt-4 pt-4 border-t border-setu-50 text-[13px] font-semibold text-setu-600 hover:text-setu-700 no-underline transition-colors"
                  >
                    View All Teams <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Badge legend */}
                <div className="bg-setu-50 rounded-2xl border border-setu-100 p-6">
                  <h3
                    className="text-[15px] font-bold text-setu-950 mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Donor Badges
                  </h3>
                  {Object.entries(badgeConfig).map(([key, cfg]) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 mb-3 last:mb-0"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-b ${cfg.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <cfg.icon className={`w-4 h-4 ${cfg.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-setu-900">
                          {cfg.label}
                        </p>
                        <p className="text-[11px] text-setu-600/60">
                          {cfg.threshold}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Join CTA */}
                <div className="bg-setu-900 rounded-2xl p-6 text-center">
                  <Star className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <h3
                    className="text-[16px] font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Earn Your Place
                  </h3>
                  <p className="text-[13px] text-white/50 mb-5 leading-[1.6]">
                    Start donating today and climb the Hall of Fame.
                  </p>
                  <Link
                    href="/campaigns"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-setu-500 hover:bg-setu-400 text-white text-[13px] font-bold rounded-full no-underline transition-colors shadow-[0_4px_16px_rgba(34,160,91,0.35)]"
                  >
                    Browse Campaigns <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
