import Link from "next/link";
import {
  Heart,
  Users,
  Globe,
  TrendingUp,
  Shield,
  ArrowRight,
  MapPin,
  Star,
  ChevronRight,
  Zap,
  Eye,
  Package,
} from "lucide-react";

const team = [
  {
    name: "Dipendra Roka",
    role: "Founder & CEO",
    img: 8,
    bio: "Passionate about leveraging technology to solve Nepal's social challenges.",
  },
  {
    name: "Sita Karmacharya",
    role: "CTO",
    img: 22,
    bio: "Full-stack engineer with a decade of experience building fintech platforms.",
  },
  {
    name: "Rohan Shrestha",
    role: "Head of Operations",
    img: 15,
    bio: "Former NGO director with deep expertise in disaster relief coordination.",
  },
  {
    name: "Anjali Tamang",
    role: "Head of Community",
    img: 30,
    bio: "Community organizer who has worked across all 7 provinces of Nepal.",
  },
  {
    name: "Bikram Gurung",
    role: "Lead Designer",
    img: 45,
    bio: "UI/UX designer dedicated to making giving as simple and beautiful as possible.",
  },
  {
    name: "Priya Maharjan",
    role: "Head of Partnerships",
    img: 50,
    bio: "Builds relationships with NGOs, government bodies, and corporate donors.",
  },
];

const milestones = [
  {
    year: "2022",
    title: "Setu Founded",
    desc: "Started with a vision to unify Nepal's fragmented donation ecosystem.",
  },
  {
    year: "2023",
    title: "First 100 Campaigns",
    desc: "Reached 100 verified campaigns across medical, education, and emergency relief.",
  },
  {
    year: "2023",
    title: "NPR 50L Raised",
    desc: "Crossed NPR 50 Lakh in total donations within our first year of operation.",
  },
  {
    year: "2024",
    title: "Goods Donation Launch",
    desc: "Launched physical goods donation for disaster relief — a first in Nepal.",
  },
  {
    year: "2024",
    title: "18,400+ Donors",
    desc: "Reached 18,400 active donors supporting causes across all 77 districts.",
  },
  {
    year: "2025",
    title: "NPR 2.4Cr+ Raised",
    desc: "Crossed NPR 2.4 Crore raised — Nepal's largest unified giving platform.",
  },
];

const values = [
  {
    icon: Shield,
    title: "Transparency",
    desc: "Every rupee is tracked and reported. Donors always know exactly how their contribution is being used.",
    color: "text-setu-600",
    bg: "bg-setu-50",
  },
  {
    icon: Heart,
    title: "Compassion",
    desc: "We put people first — whether it's a flood victim, a cancer patient, or a child who needs a school.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Zap,
    title: "Speed",
    desc: "In emergencies, minutes matter. Our express disbursement system gets funds to verified campaigns within 24 hours.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Globe,
    title: "Inclusivity",
    desc: "We serve all 77 districts of Nepal, from Humla to Jhapa, ensuring no community is left behind.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

export default function AboutPage() {
  return (
    <div
      className="bg-cream min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ── HERO ── */}
      <section className="bg-setu-950 py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(34,160,91,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-setu-800/20 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-setu-800/30 rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-400 mb-5">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              Our Story
            </div>
            <h1
              className="text-[clamp(40px,5.5vw,70px)] font-bold text-white leading-[1.04] tracking-[-2px] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Bridging Nepal's
              <br />
              <em className="italic text-setu-400">Heart of Giving.</em>
            </h1>
            <p className="text-[17px] text-white/50 leading-[1.8] max-w-xl mb-10">
              Setu — meaning "bridge" in Nepali — was born from a simple belief:
              that every Nepali deserves access to help when they need it most,
              and every donor deserves to see their impact clearly.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/campaigns"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-setu-500 hover:bg-setu-400 text-white text-[14px] font-bold rounded-full no-underline shadow-[0_6px_20px_rgba(34,160,91,0.35)] hover:-translate-y-0.5 transition-all"
              >
                See Our Impact <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 hover:bg-white/10 text-white text-[14px] font-semibold rounded-full no-underline transition-all"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-setu-900">
        {[
          { icon: TrendingUp, num: "NPR 2.4Cr+", label: "Total Raised" },
          { icon: Heart, num: "1,200+", label: "Campaigns Funded" },
          { icon: Users, num: "18,400+", label: "Active Donors" },
          { icon: MapPin, num: "77", label: "Districts Served" },
        ].map(({ icon: Icon, num, label }, i) => (
          <div
            key={label}
            className={`flex items-center gap-4 px-6 lg:px-8 py-8 ${i < 3 ? "border-r border-white/[0.07]" : ""} hover:bg-white/[0.03] transition-colors`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-setu-300" />
            </div>
            <div>
              <p
                className="text-[22px] lg:text-[26px] font-bold text-white leading-none mb-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {num}
              </p>
              <p className="text-[11px] text-white/40 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MISSION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
                <div className="w-6 h-[2px] bg-setu-500 rounded" />
                Mission & Vision
              </div>
              <h2
                className="text-[clamp(30px,4vw,48px)] font-bold text-setu-950 leading-tight tracking-[-0.5px] mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Technology for
                <br />
                <em className="italic text-setu-600">Social Good</em>
              </h2>
              <p className="text-[16px] text-gray-500 leading-[1.8] mb-6">
                Nepal faces recurring disasters, widespread poverty, and limited
                access to healthcare and education. While the spirit of giving
                is strong, the infrastructure to channel it effectively has been
                broken — until now.
              </p>
              <p className="text-[16px] text-gray-500 leading-[1.8] mb-8">
                Setu connects verified campaigns with real donors through a
                transparent, real-time platform. No middlemen. No hidden fees.
                Just direct impact.
              </p>
              <div className="flex gap-4 flex-wrap">
                {[
                  { n: "0%", l: "Hidden fees for donors" },
                  { n: "< 24h", l: "Campaign verification" },
                  { n: "100%", l: "Verified campaigns" },
                ].map(({ n, l }) => (
                  <div
                    key={l}
                    className="bg-setu-50 rounded-2xl border border-setu-100 px-5 py-4 text-center"
                  >
                    <p
                      className="text-[22px] font-bold text-setu-800"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {n}
                    </p>
                    <p className="text-[12px] text-setu-600/60 mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&q=85&auto=format&fit=crop"
                alt="Setu mission"
                className="rounded-3xl w-full h-[440px] object-cover shadow-[0_24px_60px_rgba(21,104,57,0.15)]"
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl border border-setu-100 shadow-[0_8px_28px_rgba(21,104,57,0.12)] p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-setu-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div>
                    <p
                      className="text-[15px] font-bold text-setu-900"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      NPR 2.4Cr+
                    </p>
                    <p className="text-[11px] text-setu-600/60">
                      raised for Nepal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 bg-setu-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              What We Stand For
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
            </div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-bold text-setu-950 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-7 border border-setu-100 hover:shadow-[0_8px_28px_rgba(21,104,57,0.08)] hover:-translate-y-1 transition-all duration-300"
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
                <p className="text-[13px] text-gray-500 leading-[1.7]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              Our Journey
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
            </div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-bold text-setu-950 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Building the Bridge
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-setu-700 flex items-center justify-center text-white text-[11px] font-black border-4 border-white shadow-[0_0_0_2px_rgba(21,104,57,0.2)]">
                    {i + 1}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-setu-100 mt-2" />
                  )}
                </div>
                <div className="pb-2">
                  <span className="text-[11px] font-bold text-setu-500 uppercase tracking-wide">
                    {m.year}
                  </span>
                  <h3
                    className="text-[17px] font-bold text-setu-950 mt-0.5 mb-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {m.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 leading-[1.7]">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 bg-setu-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-setu-600 mb-4">
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
              The People
              <div className="w-6 h-[2px] bg-setu-500 rounded" />
            </div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-bold text-setu-950 tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Meet the Team
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map(({ name, role, img, bio }) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-6 border border-setu-100 hover:shadow-[0_8px_28px_rgba(21,104,57,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://i.pravatar.cc/80?img=${img}`}
                    alt={name}
                    className="w-14 h-14 rounded-full border-2 border-setu-100 object-cover"
                  />
                  <div>
                    <p
                      className="text-[15px] font-bold text-setu-950"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {name}
                    </p>
                    <p className="text-[12px] text-setu-600 font-medium">
                      {role}
                    </p>
                  </div>
                </div>
                <p className="text-[13px] text-gray-500 leading-[1.7]">{bio}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-setu-700 hover:bg-setu-600 text-white text-[14px] font-bold rounded-full no-underline shadow-[0_6px_20px_rgba(21,104,57,0.3)] hover:-translate-y-0.5 transition-all"
            >
              Join Our Team <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-setu-950 relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 rounded-[28px] mb-16 mt-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,160,91,0.15) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center px-6">
          <h2
            className="text-[clamp(32px,4vw,52px)] font-bold text-white leading-[1.07] tracking-[-1px] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Be Part of the
            <br />
            <em className="italic text-setu-400">Bridge.</em>
          </h2>
          <p className="text-[16px] text-white/45 mb-10 leading-[1.75]">
            Every donation, every campaign, every share builds a stronger Nepal.
          </p>
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 px-8 py-4 bg-setu-500 hover:bg-setu-400 text-white text-[15px] font-bold rounded-full no-underline shadow-[0_8px_28px_rgba(34,160,91,0.4)] hover:-translate-y-0.5 transition-all"
          >
            Start Giving Today <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
