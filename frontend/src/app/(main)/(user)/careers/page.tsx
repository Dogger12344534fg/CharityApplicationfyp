// ═══════════════════════════════════════════════
// CAREERS PAGE — app/(main)/careers/page.tsx
// ═══════════════════════════════════════════════
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Briefcase,
  Clock,
  Heart,
  Users,
  Zap,
  Globe,
  ChevronRight,
  Star,
} from "lucide-react";

const openings = [
  {
    id: "1",
    title: "Senior Full-Stack Engineer",
    dept: "Engineering",
    location: "Kathmandu / Remote",
    type: "Full-time",
    level: "Senior",
  },
  {
    id: "2",
    title: "Product Designer (UI/UX)",
    dept: "Design",
    location: "Kathmandu",
    type: "Full-time",
    level: "Mid",
  },
  {
    id: "3",
    title: "Campaign Verification Officer",
    dept: "Operations",
    location: "Kathmandu",
    type: "Full-time",
    level: "Mid",
  },
  {
    id: "4",
    title: "Community Manager",
    dept: "Community",
    location: "Nepal-wide",
    type: "Full-time",
    level: "Junior",
  },
  {
    id: "5",
    title: "Growth & Partnerships Lead",
    dept: "Business",
    location: "Kathmandu",
    type: "Full-time",
    level: "Senior",
  },
  {
    id: "6",
    title: "Content Writer (Nepali/English)",
    dept: "Marketing",
    location: "Remote",
    type: "Part-time",
    level: "Junior",
  },
];

const deptColors: Record<string, string> = {
  Engineering: "bg-blue-50 text-blue-700 border-blue-100",
  Design: "bg-purple-50 text-purple-700 border-purple-100",
  Operations: "bg-setu-50 text-setu-700 border-setu-200",
  Community: "bg-amber-50 text-amber-700 border-amber-100",
  Business: "bg-orange-50 text-orange-700 border-orange-100",
  Marketing: "bg-pink-50 text-pink-700 border-pink-100",
};

const perks = [
  {
    icon: Heart,
    title: "Mission-Driven Work",
    desc: "Every line of code, every campaign review — all of it directly helps people in need across Nepal.",
  },
  {
    icon: Globe,
    title: "Remote-Friendly",
    desc: "Most roles are open to remote work across Nepal. We believe in flexibility and trust.",
  },
  {
    icon: Zap,
    title: "High Ownership",
    desc: "We're small and moving fast. You'll own real features and have direct impact from your first week.",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    desc: "A small, tight-knit team that genuinely cares about each other and the communities we serve.",
  },
  {
    icon: Star,
    title: "Competitive Compensation",
    desc: "Market-competitive salaries, equity participation, and annual performance bonuses.",
  },
  {
    icon: Briefcase,
    title: "Growth & Learning",
    desc: "Annual learning budget, conference sponsorship, and access to Nepal's growing tech ecosystem.",
  },
];

export function CareersPage() {
  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Hero */}
      <section className="bg-setu-950 py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(34,160,91,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-400 mb-5">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              Join the Team
            </div>
            <h1
              className="text-[clamp(38px,5vw,62px)] font-bold text-white leading-[1.04] tracking-[-2px] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Build the Bridge
              <br />
              <em className="italic text-setu-400">With Us.</em>
            </h1>
            <p className="text-[17px] text-white/50 leading-[1.8] max-w-xl mb-8">
              We're a small, passionate team on a mission to transform how Nepal
              gives and receives help. If you want your work to matter, you're
              in the right place.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex -space-x-2">
                {[8, 22, 15, 30, 45, 50].map((n) => (
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/40?img=${n}`}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-setu-900 object-cover"
                  />
                ))}
              </div>
              <p className="text-[14px] text-white/60">
                <strong className="text-white">12 people</strong> on a mission
                to change Nepal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-[clamp(26px,3.5vw,40px)] font-bold text-setu-950 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Why Work at Setu
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-6 bg-setu-50 rounded-2xl border border-setu-100 hover:bg-white hover:shadow-[0_4px_16px_rgba(21,104,57,0.07)] transition-all"
              >
                <div className="w-10 h-10 bg-setu-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3
                    className="text-[15px] font-bold text-setu-950 mb-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-[1.7]">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-14 bg-setu-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-[22px] font-bold text-setu-950"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Open Positions
            </h2>
            <span className="text-[13px] text-setu-600/55 font-medium">
              {openings.length} openings
            </span>
          </div>
          <div className="space-y-3">
            {openings.map(({ id, title, dept, location, type, level }) => (
              <Link
                key={id}
                href={`/careers/${id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-setu-100 hover:border-setu-300 hover:shadow-[0_6px_20px_rgba(21,104,57,0.1)] transition-all duration-200 no-underline"
              >
                <div>
                  <h3
                    className="text-[16px] font-bold text-setu-950 group-hover:text-setu-700 transition-colors mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${deptColors[dept]}`}
                    >
                      {dept}
                    </span>
                    <div className="flex items-center gap-1 text-[12px] text-setu-600/55">
                      <MapPin className="w-3 h-3" />
                      {location}
                    </div>
                    <div className="flex items-center gap-1 text-[12px] text-setu-600/55">
                      <Clock className="w-3 h-3" />
                      {type}
                    </div>
                    <div className="flex items-center gap-1 text-[12px] text-setu-600/55">
                      <Briefcase className="w-3 h-3" />
                      {level}
                    </div>
                  </div>
                </div>
                <span className="flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 bg-setu-700 group-hover:bg-setu-600 text-white text-[13px] font-bold rounded-full transition-colors self-start sm:self-auto">
                  Apply Now <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 bg-setu-100 rounded-2xl p-7 text-center border border-setu-200">
            <h3
              className="text-[17px] font-bold text-setu-950 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Don't see your role?
            </h3>
            <p className="text-[14px] text-setu-700/70 mb-5">
              We're always looking for exceptional people. Send us your resume
              and we'll reach out when the right role opens.
            </p>
            <a
              href="mailto:careers@setu.np"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-setu-700 hover:bg-setu-600 text-white text-[14px] font-bold rounded-full no-underline shadow-[0_4px_14px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 transition-all"
            >
              Send Open Application <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CareersPage;
