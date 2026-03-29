import Link from "next/link";
import { Users, ChevronRight, MapPin, Clock } from "lucide-react";

export const catConfig: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  medical: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
  },
  education: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
  },
  emergency: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-100",
  },
  charity: {
    bg: "bg-setu-50",
    text: "text-setu-700",
    border: "border-setu-200",
  },
  animals: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-100",
  },
};

export type Campaign = {
  id: string;
  title: string;
  desc: string;
  img: string;
  raised: number;
  goal: number;
  donors: number;
  cat: string;
  catClass: string;
  urgent?: boolean;
  featured?: boolean;
  location: string;
  daysLeft?: number;
};

export function CampaignCard({
  c,
  large = false,
}: {
  c: Campaign;
  large?: boolean;
}) {
  const pct = Math.min(Math.round((c.raised / c.goal) * 100), 100);
  const cfg = catConfig[c.catClass] ?? catConfig.charity;

  // Large card: horizontal layout — image left, content right
  if (large) {
    return (
      <Link
        href={`/campaigns/${c.id}`}
        className="group md:col-span-2 flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] hover:shadow-[0_20px_48px_rgba(21,104,57,0.14)] hover:-translate-y-1 hover:border-setu-200 transition-all duration-300"
      >
        {/* Image — left half */}
        <div className="relative md:w-[52%] flex-shrink-0 h-56 md:h-auto overflow-hidden">
          <img
            src={c.img}
            alt={c.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
          <span
            className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wide ${cfg.bg} ${cfg.text} ${cfg.border}`}
          >
            {c.cat}
          </span>
          {c.urgent && (
            <span className="absolute top-3 right-3 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-red-500 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Urgent
            </span>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3" />
            {c.location}
          </div>
        </div>

        {/* Content — right half */}
        <div className="flex flex-col justify-center p-7 flex-1">
          <h3
            className="font-bold text-[20px] text-setu-950 leading-snug mb-3 group-hover:text-setu-700 transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {c.title}
          </h3>
          <p className="text-[14px] text-gray-500 leading-relaxed mb-6 line-clamp-3">
            {c.desc}
          </p>
          <div className="h-1.5 bg-setu-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-setu-700 to-setu-400 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[14px] mb-6">
            <span>
              <strong className="text-setu-800 font-bold">
                NPR {c.raised.toLocaleString()}
              </strong>
              <span className="text-gray-400 ml-1">
                of {c.goal.toLocaleString()}
              </span>
            </span>
            <strong className="text-setu-600 font-bold">{pct}%</strong>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-setu-50">
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
              <Users className="w-4 h-4 text-setu-400" />
              {c.donors.toLocaleString()} donors
            </div>
            <span className="flex items-center gap-1.5 px-5 py-2.5 bg-setu-700 group-hover:bg-setu-600 text-white text-[13px] font-bold rounded-full transition-colors duration-200">
              Donate Now
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Regular card: vertical layout
  return (
    <Link
      href={`/campaigns/${c.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] hover:shadow-[0_20px_48px_rgba(21,104,57,0.14)] hover:-translate-y-1.5 hover:border-setu-200 transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={c.img}
          alt={c.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <span
          className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wide ${cfg.bg} ${cfg.text} ${cfg.border}`}
        >
          {c.cat}
        </span>
        {c.urgent && (
          <span className="absolute top-3 right-3 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-red-500 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Urgent
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
          <MapPin className="w-3 h-3" />
          {c.location}
        </div>
        {c.daysLeft !== undefined && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            {c.daysLeft}d left
          </div>
        )}
      </div>
      <div className="p-5">
        <h3
          className="font-bold text-[15px] text-setu-950 leading-snug mb-2 group-hover:text-setu-700 transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {c.title}
        </h3>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {c.desc}
        </p>
        <div className="h-1.5 bg-setu-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-setu-700 to-setu-400 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[13px] mb-4">
          <span>
            <strong className="text-setu-800 font-bold">
              NPR {c.raised.toLocaleString()}
            </strong>
            <span className="text-gray-400 ml-1">
              of {c.goal.toLocaleString()}
            </span>
          </span>
          <strong className="text-setu-600 font-bold">{pct}%</strong>
        </div>
        <div className="flex items-center justify-between pt-3.5 border-t border-setu-50">
          <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium">
            <Users className="w-3.5 h-3.5 text-setu-400" />
            {c.donors.toLocaleString()} donors
          </div>
          <span className="flex items-center gap-1.5 px-4 py-2 bg-setu-700 group-hover:bg-setu-600 text-white text-[12px] font-bold rounded-full transition-colors duration-200">
            Donate Now
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function AllCampaignCard({ c }: { c: Campaign }) {
  const pct = Math.min(Math.round((c.raised / c.goal) * 100), 100);
  const cfg = catConfig[c.catClass] ?? catConfig.charity;
  return (
    <Link
      href={`/campaigns/${c.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-setu-100 shadow-[0_2px_12px_rgba(21,104,57,0.06)] hover:shadow-[0_16px_40px_rgba(21,104,57,0.12)] hover:-translate-y-1 hover:border-setu-200 transition-all duration-300"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={c.img}
          alt={c.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <span
          className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${cfg.bg} ${cfg.text} ${cfg.border}`}
        >
          {c.cat}
        </span>
        {c.urgent && (
          <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Urgent
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2 py-0.5 rounded-full">
          <MapPin className="w-3 h-3" />
          {c.location}
        </div>
      </div>
      <div className="p-5">
        <h3
          className="font-bold text-[15px] text-setu-950 leading-snug mb-1.5 group-hover:text-setu-700 transition-colors line-clamp-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {c.title}
        </h3>
        <p className="text-[12px] text-gray-500 leading-relaxed mb-3.5 line-clamp-2">
          {c.desc}
        </p>
        <div className="h-1.5 bg-setu-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-setu-700 to-setu-400 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[12px] mb-3.5">
          <strong className="text-setu-800">
            NPR {c.raised.toLocaleString()}
          </strong>
          <strong className="text-setu-600">{pct}%</strong>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-setu-50">
          <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <Users className="w-3 h-3 text-setu-400" />
            {c.donors.toLocaleString()} donors
          </div>
          <span className="flex items-center gap-1 px-3 py-1.5 bg-setu-700 group-hover:bg-setu-600 text-white text-[11px] font-bold rounded-full transition-colors">
            Donate <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
