import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Users,
  Package,
  Zap,
  CreditCard,
} from "lucide-react";

export default function DonatePage() {
  return (
    <div className="bg-[#f5f7f4] text-setu-950 min-h-screen">
      {/* ── Hero ── */}
      <section className="bg-setu-900 pt-16 pb-14 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(42,165,88,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-setu-400 animate-pulse flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">
              Every rupee makes a difference
            </span>
          </div>
          <h1
            className="text-[clamp(32px,5vw,52px)] font-bold text-white leading-[1.08] tracking-[-1.5px] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Choose How You{" "}
            <em className="italic text-setu-400">Want to Give</em>
          </h1>
          <p className="text-[15px] text-white/55 leading-[1.75] max-w-md mx-auto">
            Money, goods, or emergency relief — every form of giving changes
            lives across Nepal.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 mb-12 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: "NPR 4.2Cr+", label: "Total donated" },
            { num: "18,400+", label: "Donors" },
            { num: "4,800+", label: "Goods packages sent" },
          ].map(({ num, label }) => (
            <div
              key={label}
              className="bg-white border border-setu-100 rounded-2xl py-5 px-4 text-center shadow-sm"
            >
              <div className="text-[22px] sm:text-[26px] font-bold text-setu-700 leading-none">
                {num}
              </div>
              <div className="text-[12px] text-setu-600/70 mt-1.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Three Donation Cards ── */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-3">
          <div className="w-6 h-[2px] bg-setu-500 rounded" />
          Ways to donate
        </div>
        <h2
          className="text-[clamp(24px,3vw,36px)] font-bold text-setu-950 tracking-[-0.5px] mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Pick your path to impact
        </h2>
        <p className="text-[14px] text-setu-600/80 mb-10">
          Three ways to give — all transparent, all verified, all going directly
          to those who need it most.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Money Donation */}
          <div className="relative bg-white rounded-[20px] border border-setu-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(26,110,57,0.15)] transition-all duration-200">
            <span className="absolute top-3.5 right-3.5 bg-setu-700 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wide">
              Most popular
            </span>
            <div className="h-40 bg-gradient-to-br from-setu-50 to-setu-100 flex items-center justify-center flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-setu-700 flex items-center justify-center shadow-[0_8px_20px_rgba(26,110,57,0.3)]">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-setu-50 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-setu-700" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-setu-600">
                  Money Donation
                </span>
              </div>
              <h3
                className="text-[16px] font-bold text-setu-950 mb-2 leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Send funds directly to verified campaigns
              </h3>
              <p className="text-[13px] text-setu-600/80 leading-[1.65] mb-4 flex-1">
                Contribute any amount via secure payment. Track every rupee in
                real-time and see exactly where it goes.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["Instant transfer", "Live tracking", "SSL secured"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-setu-50 text-setu-700 text-[11px] font-semibold rounded-full"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {tag}
                    </span>
                  ),
                )}
              </div>
              <Link
                href="/campaigns"
                className="flex items-center justify-between px-4 py-3 bg-setu-700 hover:bg-setu-600 text-white text-[13px] font-bold rounded-xl no-underline transition-colors"
              >
                Donate money now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Goods Donation */}
          <div className="bg-white rounded-[20px] border border-setu-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(26,110,57,0.1)] hover:border-setu-300 transition-all duration-200">
            <div className="h-40 bg-gradient-to-br from-setu-50 to-setu-100 flex items-center justify-center flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-setu-700 flex items-center justify-center shadow-[0_8px_20px_rgba(26,110,57,0.25)]">
                <Package className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-setu-50 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-setu-700" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-setu-700">
                  Goods Donation
                </span>
              </div>
              <h3
                className="text-[16px] font-bold text-setu-950 mb-2 leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Rice, clothes, medicine &amp; essential supplies
              </h3>
              <p className="text-[13px] text-setu-600/80 leading-[1.65] mb-4 flex-1">
                Send physical goods directly to communities hit by floods,
                earthquakes, and emergencies across Nepal.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {[
                  "🌾 Rice & food",
                  "👕 Clothes",
                  "💊 Medicine",
                  "⛺ Shelter",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-setu-50 text-setu-700 text-[11px] font-semibold rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="/donations/goods"
                className="flex items-center justify-between px-4 py-3 bg-setu-700 hover:bg-setu-600 text-white text-[13px] font-bold rounded-xl no-underline transition-colors"
              >
                Donate goods
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Emergency Relief */}
          <div className="bg-white rounded-[20px] border border-setu-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(26,110,57,0.1)] hover:border-setu-300 transition-all duration-200">
            <div className="h-40 bg-gradient-to-br from-setu-50 to-setu-100 flex items-center justify-center flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-setu-700 flex items-center justify-center shadow-[0_8px_20px_rgba(200,80,0,0.25)]">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-setu-50 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-setu-700" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-setu-700">
                  Emergency Relief
                </span>
              </div>
              <h3
                className="text-[16px] font-bold text-setu-950 mb-2 leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Disaster response when it matters most
              </h3>
              <p className="text-[13px] text-setu-600/80 leading-[1.65] mb-4 flex-1">
                Contribute to active disaster relief campaigns. Funds are
                deployed within hours to affected communities.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["Active crisis", "Fast deployment", "Direct aid"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-setu-50 text-setu-700 text-[11px] font-semibold rounded-full"
                    >
                      <Zap className="w-3 h-3" />
                      {tag}
                    </span>
                  ),
                )}
              </div>
              <Link
                href="/campaigns?category=emergency"
                className="flex items-center justify-between px-4 py-3 bg-setu-700 hover:bg-setu-600 text-white text-[13px] font-bold rounded-xl no-underline transition-colors"
              >
                View active campaigns
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-setu-600 mb-3">
          <div className="w-6 h-[2px] bg-setu-500 rounded" />
          Why trust Setu
        </div>
        <h2
          className="text-[clamp(22px,3vw,32px)] font-bold text-setu-950 tracking-[-0.5px] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Safe, verified, transparent
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: ShieldCheck,
              title: "256-bit SSL",
              sub: "Every transaction encrypted",
              bg: "bg-setu-50",
              iconColor: "text-setu-700",
            },
            {
              icon: CheckCircle,
              title: "Verified campaigns",
              sub: "Manually reviewed by our team",
              bg: "bg-blue-50",
              iconColor: "text-blue-600",
            },
            {
              icon: Clock,
              title: "Real-time tracking",
              sub: "See where every rupee goes",
              bg: "bg-amber-50",
              iconColor: "text-amber-600",
            },
            {
              icon: Users,
              title: "18,400+ donors",
              sub: "Trusted by Nepal's community",
              bg: "bg-purple-50",
              iconColor: "text-purple-600",
            },
          ].map(({ icon: Icon, title, sub, bg, iconColor }) => (
            <div
              key={title}
              className="flex items-center gap-3 bg-white border border-setu-100 rounded-xl p-4"
            >
              <div
                className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-setu-950">{title}</p>
                <p className="text-[11px] text-setu-600/70 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-setu-900 py-20 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,160,91,0.14) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-xl mx-auto">
          <h2
            className="text-[clamp(28px,4vw,42px)] font-bold text-white leading-tight tracking-[-0.5px] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Not sure where to start?
            <br />
            <em className="italic text-setu-400">Browse all campaigns.</em>
          </h2>
          <p className="text-[15px] text-white/45 leading-[1.75] mb-10">
            Explore hundreds of verified campaigns across medical, education,
            disaster relief, and more.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 px-8 py-4 bg-setu-500 hover:bg-setu-400 text-white text-[14px] font-bold rounded-full no-underline transition-all duration-200 shadow-[0_8px_28px_rgba(34,160,91,0.4)] hover:-translate-y-0.5"
            >
              Browse Campaigns <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/[0.07] border border-white/15 hover:bg-white/[0.12] text-white/80 hover:text-white text-[14px] font-semibold rounded-full no-underline transition-all duration-200"
            >
              <Users className="w-4 h-4" /> Join a Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
