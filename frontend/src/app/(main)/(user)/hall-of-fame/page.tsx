import Link from "next/link";
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Heart,
  Users,
  Crown,
  Award,
  ArrowRight,
  ChevronRight,
  MapPin,
  Flame,
  Shield,
} from "lucide-react";

const topDonors = [
  {
    rank: 1,
    name: "Ramesh Shrestha",
    amt: "NPR 2,50,000",
    donations: 34,
    img: 8,
    badge: "gold",
    location: "Kathmandu",
    campaigns: 8,
    streak: 12,
  },
  {
    rank: 2,
    name: "Sunita Tamang",
    amt: "NPR 1,80,000",
    donations: 28,
    img: 12,
    badge: "silver",
    location: "Pokhara",
    campaigns: 6,
    streak: 8,
  },
  {
    rank: 3,
    name: "Bikash Rai",
    amt: "NPR 1,42,000",
    donations: 22,
    img: 15,
    badge: "bronze",
    location: "Lalitpur",
    campaigns: 5,
    streak: 6,
  },
  {
    rank: 4,
    name: "Priya Thapa",
    amt: "NPR 1,15,000",
    donations: 19,
    img: 20,
    badge: null,
    location: "Biratnagar",
    campaigns: 4,
    streak: 4,
  },
  {
    rank: 5,
    name: "Anish Gurung",
    amt: "NPR 98,500",
    donations: 15,
    img: 25,
    badge: null,
    location: "Chitwan",
    campaigns: 3,
    streak: 3,
  },
  {
    rank: 6,
    name: "Meena Karki",
    amt: "NPR 87,000",
    donations: 12,
    img: 30,
    badge: null,
    location: "Dharan",
    campaigns: 4,
    streak: 5,
  },
  {
    rank: 7,
    name: "Dipendra Adhikari",
    amt: "NPR 76,500",
    donations: 11,
    img: 35,
    badge: null,
    location: "Hetauda",
    campaigns: 3,
    streak: 2,
  },
  {
    rank: 8,
    name: "Rupa Maharjan",
    amt: "NPR 65,000",
    donations: 9,
    img: 40,
    badge: null,
    location: "Patan",
    campaigns: 2,
    streak: 4,
  },
  {
    rank: 9,
    name: "Sanjay Lama",
    amt: "NPR 58,000",
    donations: 8,
    img: 45,
    badge: null,
    location: "Bhaktapur",
    campaigns: 3,
    streak: 1,
  },
  {
    rank: 10,
    name: "Anjali Shrestha",
    amt: "NPR 52,000",
    donations: 7,
    img: 50,
    badge: null,
    location: "Kathmandu",
    campaigns: 2,
    streak: 3,
  },
];

const topTeams = [
  {
    rank: 1,
    name: "Flood Response Force",
    amt: "NPR 5,20,000",
    members: 40,
    img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=80&q=80&auto=format&fit=crop",
  },
  {
    rank: 2,
    name: "Kathmandu Cares Collective",
    amt: "NPR 4,80,000",
    members: 24,
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=80&q=80&auto=format&fit=crop",
  },
  {
    rank: 3,
    name: "Pokhara Relief Network",
    amt: "NPR 3,20,000",
    members: 18,
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=80&q=80&auto=format&fit=crop",
  },
];

const badgeConfig = {
  gold: {
    bg: "from-amber-100 to-amber-500",
    ring: "ring-amber-400",
    icon: Crown,
    iconColor: "text-amber-600",
    label: "Gold Donor",
  },
  silver: {
    bg: "from-slate-100 to-slate-400",
    ring: "ring-slate-300",
    icon: Medal,
    iconColor: "text-slate-500",
    label: "Silver Donor",
  },
  bronze: {
    bg: "from-orange-100 to-orange-600",
    ring: "ring-orange-400",
    icon: Award,
    iconColor: "text-orange-700",
    label: "Bronze Donor",
  },
};

export default function HallOfFamePage() {
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

      {/* ── PODIUM — TOP 3 ── */}
      <section className="py-16 bg-white border-b border-setu-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-center gap-6 sm:gap-10 mb-4">
            {/* Reorder: 2, 1, 3 for visual podium */}
            {[topDonors[1], topDonors[0], topDonors[2]].map((d) => {
              const cfg = badgeConfig[d.badge as keyof typeof badgeConfig];
              const isFirst = d.rank === 1;
              return (
                <div key={d.rank} className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <img
                      src={`https://i.pravatar.cc/100?img=${d.img}`}
                      alt={d.name}
                      className={[
                        "rounded-full object-cover border-4 border-white shadow-xl ring-2",
                        cfg.ring,
                        isFirst ? "w-24 h-24" : "w-18 h-18",
                      ].join(" ")}
                      style={{
                        width: isFirst ? 96 : 72,
                        height: isFirst ? 96 : 72,
                      }}
                    />
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
                    {d.amt}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-3">
                    <MapPin className="w-3 h-3" />
                    {d.location}
                  </div>
                  <div
                    className={`w-28 sm:w-32 ${isFirst ? "h-[140px]" : d.rank === 2 ? "h-[100px]" : "h-[80px]"} bg-gradient-to-b ${cfg.bg} rounded-t-2xl flex flex-col items-center justify-start pt-4 gap-1`}
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

      {/* ── FULL LEADERBOARD ── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Individual donors table */}
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

              <div className="space-y-2">
                {topDonors.slice(3).map((d) => (
                  <div
                    key={d.rank}
                    className="flex items-center gap-4 px-5 py-4 bg-white rounded-2xl border border-setu-100 hover:bg-setu-50 hover:border-setu-200 hover:shadow-[0_4px_16px_rgba(21,104,57,0.08)] transition-all duration-200 cursor-pointer"
                  >
                    <div
                      className="w-9 h-9 bg-setu-700 text-white rounded-xl flex items-center justify-center text-[13px] font-black flex-shrink-0"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {d.rank}
                    </div>
                    <img
                      src={`https://i.pravatar.cc/44?img=${d.img}`}
                      alt={d.name}
                      className="w-11 h-11 rounded-full border-2 border-setu-100 object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[15px] font-bold text-setu-900">
                          {d.name}
                        </p>
                        {d.streak > 3 && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                            <Flame className="w-3 h-3" />
                            {d.streak}mo streak
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[12px] text-setu-600/55 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {d.location}
                        </span>
                        <span className="text-[12px] text-setu-600/55">
                          {d.campaigns} campaigns
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[15px] font-bold text-setu-800">
                        {d.amt}
                      </p>
                      <p className="text-[11px] text-setu-600/55">
                        {d.donations} donations
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side panel */}
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
                {topTeams.map((t, i) => (
                  <Link
                    key={t.rank}
                    href={`/teams/${t.rank}`}
                    className={`flex items-center gap-3 py-3.5 hover:bg-setu-50 px-2 rounded-xl transition-colors cursor-pointer no-underline ${i < 2 ? "border-b border-setu-50" : ""} block`}
                  >
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black flex-shrink-0 ${i === 0 ? "bg-amber-400 text-amber-950" : i === 1 ? "bg-slate-400 text-white" : "bg-orange-500 text-white"}`}
                    >
                      {t.rank}
                    </span>
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-9 h-9 rounded-full border-2 border-setu-100 object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-setu-900 truncate">
                        {t.name}
                      </p>
                      <p className="text-[11px] text-setu-600/60">
                        {t.amt} · {t.members} members
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-setu-300 flex-shrink-0" />
                  </Link>
                ))}
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
                        {key === "gold"
                          ? "NPR 2L+"
                          : key === "silver"
                            ? "NPR 1L–2L"
                            : "NPR 50K–1L"}
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
    </div>
  );
}
