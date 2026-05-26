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
    <div className="group block perspective-1000 h-[390px]">
      <div className="relative w-full h-[390px] transition-transform duration-1000 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

        {/* FRONT */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-2xl overflow-hidden border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] flex flex-col">
          {/* Image */}
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            {t.avatar ? (
              <img
                src={t.avatar}
                alt={t.name}
                className="w-full h-full object-cover transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-setu-100 flex items-center justify-center">
                <Users className="w-10 h-10 text-setu-300" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

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

            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
              <MapPin className="w-3 h-3" />
              {t.location}
            </div>

            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
              <Users className="w-3 h-3" />
              {t.members} members
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className="font-bold text-[15px] text-setu-950 leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.name}
              </h3>
              {t.rank !== undefined && (
                <span className="text-[12px] font-bold text-setu-600 bg-setu-50 px-2 py-0.5 rounded-lg flex-shrink-0">
                  #{t.rank}
                </span>
              )}
            </div>

            <p className="text-[13px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
              {t.desc}
            </p>

            <div className="mt-auto">
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

                <Link
                  href={`/teams/${t.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-setu-700 text-white text-[12px] font-bold rounded-full"
                >
                  View Team <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-setu-950 text-white rounded-2xl p-7 border border-setu-800 shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="relative z-10 flex flex-col h-full w-full">
            <h3
              className="font-bold text-[18px] text-white mb-3 line-clamp-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.name}
            </h3>
            <p className="text-[13px] text-setu-200/80 mb-6 leading-relaxed line-clamp-4">
              {t.desc}
            </p>

            <div className="mt-auto w-full">
              <div className="flex items-center justify-center gap-3 text-[12px] text-setu-300 font-medium mb-4">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-setu-500" />
                  {t.members} members
                </span>
                <span className="w-1 h-1 rounded-full bg-setu-700" />
                <span>{t.campaigns} campaign{t.campaigns !== 1 ? "s" : ""}</span>
              </div>
              <Link
                href={`/teams/${t.id}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-setu-600 hover:bg-setu-500 text-white text-[14px] font-bold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(42,165,88,0.3)] hover:shadow-[0_8px_24px_rgba(42,165,88,0.4)] hover:-translate-y-0.5"
              >
                View Team
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
