import Link from "next/link";
import { Users, ChevronRight, MapPin } from "lucide-react";

export type Team = {
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
  rank?: number; // optional — not every context has a rank
};

export function TeamCard({ t }: { t: Team }) {
  const pct = Math.min(Math.round((t.raised / t.goal) * 100), 100);

  return (
    <Link
      href={`/teams/${t.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] hover:shadow-[0_20px_48px_rgba(21,104,57,0.14)] hover:-translate-y-1.5 hover:border-setu-200 transition-all duration-300"
    >
      {/* ── Image ── */}
      <div className="relative h-44 overflow-hidden">
        {t.avatar ? (
          <img
            src={t.avatar}
            alt={t.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-setu-100 flex items-center justify-center">
            <Users className="w-10 h-10 text-setu-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badge */}
        {t.badge && (
          <span
            className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
              t.badge === "Top Team"
                ? "bg-amber-400 text-amber-950"
                : "bg-setu-600 text-white"
            }`}
          >
            {t.badge}
          </span>
        )}

        {/* Location */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
          <MapPin className="w-3 h-3" />
          {t.location}
        </div>

        {/* Members */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
          <Users className="w-3 h-3" />
          {t.members} members
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-bold text-[15px] text-setu-950 leading-snug group-hover:text-setu-700 transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.name}
          </h3>
          {/* Rank badge — only shown when rank is available */}
          {t.rank !== undefined && (
            <span className="text-[12px] font-bold text-setu-600 bg-setu-50 px-2 py-0.5 rounded-lg flex-shrink-0">
              #{t.rank}
            </span>
          )}
        </div>

        <p className="text-[13px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {t.desc}
        </p>

        {/* Progress bar */}
        <div className="h-1.5 bg-setu-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-setu-700 to-setu-400 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[13px] mb-4">
          <strong className="text-setu-800">
            NPR {t.raised.toLocaleString()}
          </strong>
          <strong className="text-setu-600">{pct}%</strong>
        </div>

        <div className="flex items-center justify-between pt-3.5 border-t border-setu-50">
          <span className="text-[12px] text-gray-500 font-medium">
            {t.campaigns} campaign{t.campaigns !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5 px-4 py-2 bg-setu-700 group-hover:bg-setu-600 text-white text-[12px] font-bold rounded-full transition-colors">
            View Team <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
